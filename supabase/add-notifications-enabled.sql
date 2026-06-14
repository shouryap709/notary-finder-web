-- Per-user push notification preference (mobile Settings toggle).
alter table public.profiles
  add column if not exists notifications_enabled boolean default true;
