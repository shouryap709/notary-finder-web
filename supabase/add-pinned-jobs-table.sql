-- ============================================================
-- Notary pinned jobs for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

create table if not exists public.notary_pinned_jobs (
  notary_id uuid not null references public.profiles(id) on delete cascade,
  job_id    uuid not null references public.jobs(id) on delete cascade,
  pinned_at timestamptz default now(),
  primary key (notary_id, job_id)
);

alter table public.notary_pinned_jobs enable row level security;

create policy "pinned_jobs: own select"
  on public.notary_pinned_jobs for select
  using (auth.uid() = notary_id);

create policy "pinned_jobs: own insert"
  on public.notary_pinned_jobs for insert
  with check (auth.uid() = notary_id);

create policy "pinned_jobs: own delete"
  on public.notary_pinned_jobs for delete
  using (auth.uid() = notary_id);
