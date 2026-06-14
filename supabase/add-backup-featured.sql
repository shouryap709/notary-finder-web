-- Backup notary system — feature a job for 24h when its notary cancels late.
alter table public.jobs
  add column if not exists is_featured boolean default false;
alter table public.jobs
  add column if not exists featured_until timestamptz;

-- Clear expired featured flags (run from pg_cron alongside the bid expiry job).
create or replace function clear_expired_featured()
returns void
language sql
as $$
  update public.jobs
     set is_featured = false, featured_until = null
   where is_featured = true
     and featured_until is not null
     and featured_until < now();
$$;

-- select cron.schedule('clear-expired-featured', '*/15 * * * *', $$select clear_expired_featured();$$);
