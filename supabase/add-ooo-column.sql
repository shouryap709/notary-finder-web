-- ============================================================
-- Notary out-of-office for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.profiles
  add column if not exists ooo_until date;
