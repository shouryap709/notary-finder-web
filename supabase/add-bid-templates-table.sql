-- ============================================================
-- Notary bid templates for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

create table if not exists public.notary_bid_templates (
  id         uuid primary key default gen_random_uuid(),
  notary_id  uuid not null references public.profiles(id) on delete cascade,
  label      text not null,
  message    text,
  created_at timestamptz default now()
);

alter table public.notary_bid_templates enable row level security;

-- Notaries manage only their own templates
create policy "bid_templates: own select"
  on public.notary_bid_templates for select
  using (auth.uid() = notary_id);

create policy "bid_templates: own insert"
  on public.notary_bid_templates for insert
  with check (auth.uid() = notary_id);

create policy "bid_templates: own update"
  on public.notary_bid_templates for update
  using (auth.uid() = notary_id)
  with check (auth.uid() = notary_id);

create policy "bid_templates: own delete"
  on public.notary_bid_templates for delete
  using (auth.uid() = notary_id);
