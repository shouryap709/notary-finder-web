-- ============================================================
-- Reviews table + rating recalculation trigger for NotaryFinder
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--   3. Also run supabase/extend-job-status.sql if you haven't yet
--      (reviews RLS requires jobs.status = 'completed')
-- ============================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete set null,
  notary_id   uuid not null references public.profiles(id) on delete set null,
  rating      int  not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now(),
  unique (job_id, customer_id)  -- one review per job per customer
);

alter table public.reviews enable row level security;

-- Anyone authenticated can read reviews (for showing on notary profiles)
create policy "reviews: anyone reads"
  on public.reviews for select
  using (auth.role() = 'authenticated');

-- Only the customer of an accepted+completed job can insert a review
create policy "reviews: customer inserts on completed job"
  on public.reviews for insert
  with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.jobs
      where id = job_id and customer_id = auth.uid()
        and status = 'completed'
    )
  );

-- Customer can update or delete their own review
create policy "reviews: customer manages own"
  on public.reviews for all
  using  (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

-- ============================================================
-- Trigger: recalculate notary's rating + reviews_count after
-- any insert, update, or delete on the reviews table.
-- The client does NOT need to do any math — this is authoritative.
-- ============================================================
create or replace function recalc_notary_rating()
returns trigger as $$
declare
  target_notary_id uuid;
begin
  -- For DELETE the NEW record is null; use OLD instead
  target_notary_id := coalesce(NEW.notary_id, OLD.notary_id);

  update public.profiles
  set rating = (
        select coalesce(avg(rating)::numeric(3,2), 5.0)
        from public.reviews where notary_id = target_notary_id
      ),
      reviews_count = (
        select count(*) from public.reviews where notary_id = target_notary_id
      )
  where id = target_notary_id;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql;

-- Drop first so re-running is safe
drop trigger if exists reviews_recalc_after_change on public.reviews;

create trigger reviews_recalc_after_change
  after insert or update or delete on public.reviews
  for each row execute function recalc_notary_rating();
