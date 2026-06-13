-- ============================================================
-- Buy-it-now / instant booking for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.jobs
  add column if not exists allow_instant_book boolean default false;
