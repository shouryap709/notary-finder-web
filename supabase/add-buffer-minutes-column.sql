-- ============================================================
-- Booking buffer time for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.profiles
  add column if not exists buffer_minutes int default 15;
