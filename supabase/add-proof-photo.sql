-- Photo proof that the notary completed the signing.
-- File lives in the existing 'job-documents' bucket at {jobId}/proof.{ext}.
alter table public.jobs
  add column if not exists proof_photo_path  text,
  add column if not exists proof_uploaded_at timestamptz;
