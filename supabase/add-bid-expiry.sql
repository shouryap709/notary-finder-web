-- Bid expiration — pending bids lapse 24h after they're placed.
alter table public.bids
  add column if not exists expires_at timestamptz default (now() + interval '24 hours');

-- Backfill existing rows that predate the column.
update public.bids
   set expires_at = created_at + interval '24 hours'
 where expires_at is null and created_at is not null;

-- Mark expired pending bids as lost.
create or replace function expire_stale_bids()
returns void
language sql
as $$
  update public.bids
     set status = 'lost'
   where status = 'pending'
     and expires_at is not null
     and expires_at < now();
$$;

-- Run every 10 minutes. Requires the pg_cron extension.
-- create extension if not exists pg_cron;
select cron.schedule(
  'expire-stale-bids',
  '*/10 * * * *',
  $$select expire_stale_bids();$$
);
