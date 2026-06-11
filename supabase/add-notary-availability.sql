-- Dates a notary has blocked off. Jobs falling on these dates are hidden
-- from that notary's feed.

create table if not exists public.notary_unavailable_dates (
  id           uuid primary key default gen_random_uuid(),
  notary_id    uuid not null references auth.users(id) on delete cascade,
  blocked_date date not null,
  created_at   timestamptz not null default now(),
  unique (notary_id, blocked_date)
);

create index if not exists notary_unavailable_notary_idx
  on public.notary_unavailable_dates(notary_id);

alter table public.notary_unavailable_dates enable row level security;

create policy "Notary manages own availability"
  on public.notary_unavailable_dates for all
  using (auth.uid() = notary_id)
  with check (auth.uid() = notary_id);
