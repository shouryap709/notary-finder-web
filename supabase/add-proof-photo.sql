-- Proof-of-completion photo path (Supabase Storage, bucket job-documents).
alter table public.jobs
  add column if not exists proof_photo_path text;
