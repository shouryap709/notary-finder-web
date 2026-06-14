-- Support tickets — submitted from the help widget.
create table if not exists public.support_tickets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  email      text,
  message    text,
  status     text default 'open',
  created_at timestamptz default now()
);

alter table public.support_tickets enable row level security;

-- Anyone (incl. anon) may open a ticket.
drop policy if exists "support: anyone inserts" on public.support_tickets;
create policy "support: anyone inserts"
  on public.support_tickets for insert
  with check (true);

-- A signed-in user may read their own tickets.
drop policy if exists "support: read own" on public.support_tickets;
create policy "support: read own"
  on public.support_tickets for select
  using (auth.uid() = user_id);
