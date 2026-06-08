-- ============================================================
-- Extend jobs.status to include 'completed'
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--
-- Effect: allows UPDATE jobs SET status='completed'.
-- Run this BEFORE add-reviews-table.sql.
-- ============================================================

alter table public.jobs drop constraint if exists jobs_status_check;

alter table public.jobs add constraint jobs_status_check
  check (status in ('open', 'accepted', 'completed', 'cancelled'));
