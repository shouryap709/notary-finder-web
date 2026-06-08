-- ============================================================
-- Add file storage path columns for notary licenses and job documents
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS license_file_path text;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS document_file_path text;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS signed_document_file_path text;
