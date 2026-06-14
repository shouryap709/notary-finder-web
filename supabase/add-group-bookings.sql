-- Group bookings — one parent job that fans out into N linked jobs.
create table if not exists public.group_bookings (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references public.profiles(id) on delete set null,
  parent_job_id uuid references public.jobs(id) on delete cascade,
  num_notaries  int,
  created_at    timestamptz default now()
);

alter table public.group_bookings enable row level security;

drop policy if exists "group: own rows" on public.group_bookings;
create policy "group: own rows"
  on public.group_bookings for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

-- Tag the individual jobs that belong to a group.
alter table public.jobs
  add column if not exists group_id uuid;
