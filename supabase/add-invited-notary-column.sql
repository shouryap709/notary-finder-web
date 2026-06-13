-- ============================================================
-- Direct invitations (hire again) for NotaryFinder
--   Paste into Supabase SQL Editor and Run.
-- ============================================================

alter table public.jobs
  add column if not exists invited_notary_id uuid references public.profiles(id);
