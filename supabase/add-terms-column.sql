-- ============================================================
-- Add terms_accepted_at to profiles
-- Paste this into Supabase SQL Editor and run it once.
-- ============================================================
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz;
