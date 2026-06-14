-- Net Promoter Score responses from customers.
create table if not exists public.nps_responses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete set null,
  score      int check (score between 0 and 10),
  comment    text,
  created_at timestamptz default now()
);

alter table public.nps_responses enable row level security;

drop policy if exists "nps: insert own" on public.nps_responses;
create policy "nps: insert own"
  on public.nps_responses for insert
  with check (auth.uid() = user_id);
