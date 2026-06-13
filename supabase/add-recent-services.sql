-- Customer search history — last services a customer posted jobs for.
alter table public.profiles
  add column if not exists recent_services jsonb default '[]'::jsonb;
