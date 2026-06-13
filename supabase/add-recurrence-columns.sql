-- ============================================================
-- Recurring jobs for NotaryFinder
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
-- ============================================================

alter table public.jobs
  add column if not exists recurrence text default 'none'
    check (recurrence in ('none','weekly','biweekly','monthly'));

alter table public.jobs
  add column if not exists recurrence_parent_id uuid references public.jobs(id);
