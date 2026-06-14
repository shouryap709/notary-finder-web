-- Notary saved (bookmarked) jobs — private to each notary.
create table if not exists public.notary_saved_jobs (
  notary_id uuid references public.profiles(id) on delete cascade,
  job_id    uuid references public.jobs(id) on delete cascade,
  saved_at  timestamptz default now(),
  primary key (notary_id, job_id)
);

alter table public.notary_saved_jobs enable row level security;

drop policy if exists "saved: own rows" on public.notary_saved_jobs;
create policy "saved: own rows"
  on public.notary_saved_jobs for all
  using (auth.uid() = notary_id)
  with check (auth.uid() = notary_id);
