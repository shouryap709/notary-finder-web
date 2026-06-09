create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  link_target text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users see own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Authenticated users can create notifications"
  on public.notifications for insert
  with check (auth.uid() is not null);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);
