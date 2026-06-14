-- Commission expiration tracking.
alter table public.profiles
  add column if not exists commission_expires_at date;

-- When a notary's commission lapses, flip them back to pending verification so
-- they can't take new jobs until they renew.
create or replace function expire_lapsed_commissions()
returns void
language sql
as $$
  update public.profiles
     set verification_status = 'pending'
   where role = 'notary'
     and commission_expires_at is not null
     and commission_expires_at < current_date
     and verification_status is distinct from 'pending';
$$;

-- Run daily at 02:00 UTC. Requires the pg_cron extension.
-- create extension if not exists pg_cron;
select cron.schedule(
  'expire-lapsed-commissions',
  '0 2 * * *',
  $$select expire_lapsed_commissions();$$
);
