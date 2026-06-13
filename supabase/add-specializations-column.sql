-- ============================================================
-- Notary specialization badges for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.profiles
  add column if not exists specializations jsonb default '[]'::jsonb;
