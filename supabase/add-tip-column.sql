-- ============================================================
-- Tipping flow for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.jobs
  add column if not exists tip_amount numeric default 0;
