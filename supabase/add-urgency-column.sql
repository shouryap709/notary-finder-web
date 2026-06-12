-- Job urgency tier. Affects suggested pricing and notary feed badges.
alter table public.jobs
  add column if not exists urgency text default 'standard'
  check (urgency in ('standard', 'express', 'urgent'));
