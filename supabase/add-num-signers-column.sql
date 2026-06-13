-- ============================================================
-- Multi-signature jobs for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.jobs
  add column if not exists num_signers int default 1;
