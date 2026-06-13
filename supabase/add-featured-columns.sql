-- ============================================================
-- Featured jobs for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.jobs
  add column if not exists is_featured boolean default false;

alter table public.jobs
  add column if not exists featured_until timestamptz;
