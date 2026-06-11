-- In-app messaging, scoped to a single job.
-- Readable/writable only by the job's customer or its accepted notary.

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.jobs(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists messages_job_id_idx on public.messages(job_id, created_at);

alter table public.messages enable row level security;

-- A user may touch a job's messages if they are the customer who posted it,
-- or the notary whose bid was accepted on it.
create policy "Participants read messages"
  on public.messages for select
  using (
    exists (
      select 1
        from public.jobs j
        left join public.bids b on b.id = j.accepted_bid_id
       where j.id = messages.job_id
         and (j.customer_id = auth.uid() or b.notary_id = auth.uid())
    )
  );

create policy "Participants send messages"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
        from public.jobs j
        left join public.bids b on b.id = j.accepted_bid_id
       where j.id = messages.job_id
         and (j.customer_id = auth.uid() or b.notary_id = auth.uid())
    )
  );

alter publication supabase_realtime add table messages;
