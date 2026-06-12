-- User reports + blocks.

create table if not exists public.user_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_id uuid not null references auth.users(id) on delete cascade,
  reason      text,
  details     text,
  created_at  timestamptz not null default now(),
  status      text not null default 'open'
);

create table if not exists public.user_blocks (
  id         uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

alter table public.user_reports enable row level security;
alter table public.user_blocks enable row level security;

-- Reports: a user can file a report and read the ones they filed.
create policy "Users file reports"
  on public.user_reports for insert
  with check (auth.uid() = reporter_id);
create policy "Users read own reports"
  on public.user_reports for select
  using (auth.uid() = reporter_id);

-- Blocks: a user fully manages their own block list.
create policy "Users manage own blocks"
  on public.user_blocks for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);
