-- Newsletter signups — collect-only (anyone may insert, nobody may read via API).
create table if not exists public.newsletter_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

alter table public.newsletter_signups enable row level security;

-- Anyone (including anon) may subscribe.
drop policy if exists "newsletter: anyone inserts" on public.newsletter_signups;
create policy "newsletter: anyone inserts"
  on public.newsletter_signups for insert
  with check (true);

-- No select policy = nobody can read rows through the API.
