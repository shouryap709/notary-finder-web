-- Per-job messages between customer and notary, with read receipts.
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid references public.jobs(id) on delete cascade,
  sender_id   uuid references public.profiles(id) on delete set null,
  sender_role text check (sender_role in ('customer','notary')),
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz default now()
);

-- Read receipts (idempotent if the table predates this migration).
alter table public.messages
  add column if not exists read_at timestamptz;

alter table public.messages enable row level security;

-- Participants of the job may read/insert/update messages on it.
drop policy if exists "messages: job participants" on public.messages;
create policy "messages: job participants"
  on public.messages for all
  using (
    exists (
      select 1 from public.jobs j
      left join public.bids b on b.id = j.accepted_bid_id
      where j.id = messages.job_id
        and (j.customer_id = auth.uid() or b.notary_id = auth.uid())
    )
  )
  with check (sender_id = auth.uid());

create index if not exists messages_job_idx on public.messages(job_id);
