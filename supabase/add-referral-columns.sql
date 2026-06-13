-- ============================================================
-- Customer referral program for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.profiles
  add column if not exists referral_code text unique;

alter table public.profiles
  add column if not exists referred_by_code text;

alter table public.profiles
  add column if not exists referral_credits numeric default 0;
