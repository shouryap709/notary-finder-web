-- ============================================================
-- NotaryFinder — Supabase schema
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--   3. Set SUPABASE_CONFIG.url + SUPABASE_CONFIG.anonKey in
--      notary-marketplace.html before opening the app
--
-- Tables: profiles, jobs, bids
-- All tables have Row Level Security (RLS) enabled.
-- ============================================================

-- Enable UUID generation (usually already enabled on Supabase)
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles — one row per Supabase auth user
-- ============================================================
create table if not exists public.profiles (
  id             uuid primary key references auth.users on delete cascade,
  role           text not null check (role in ('customer', 'notary')),
  full_name      text,
  email          text,
  phone          text,
  license_number text,
  state          text,
  services       jsonb,
  rating         numeric default 5.0,
  reviews_count  int     default 0,
  created_at     timestamptz default now()
);

alter table public.profiles enable row level security;

-- Each user can fully manage their own row
create policy "profiles: own row"
  on public.profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- Any authenticated user can read all profiles (needed for bid joins)
create policy "profiles: any authenticated user can read"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- jobs — one row per posted notary job
-- (accepted_bid_id FK is added after bids table is created)
-- ============================================================
create table if not exists public.jobs (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid references public.profiles on delete set null,
  service_type      text,
  services          jsonb,
  signatures        int     default 1,
  notary_preference text,
  location_address  text,
  location_lat      numeric,
  location_lng      numeric,
  date_time         timestamptz,
  notes             text,
  starting_price    numeric,
  suggested_price   numeric,
  status            text default 'open'
                    check (status in ('open', 'accepted', 'cancelled')),
  accepted_bid_id   uuid,   -- FK to bids.id added below
  created_at        timestamptz default now()
);

alter table public.jobs enable row level security;

-- Any authenticated user can read open (or all) jobs
create policy "jobs: any authenticated user reads"
  on public.jobs for select
  using (auth.role() = 'authenticated');

-- Customers can insert their own jobs
create policy "jobs: customer inserts own job"
  on public.jobs for insert
  with check (auth.uid() = customer_id);

-- Only the posting customer can update their job
create policy "jobs: customer updates own job"
  on public.jobs for update
  using (auth.uid() = customer_id);

-- Only the posting customer can delete their job
create policy "jobs: customer deletes own job"
  on public.jobs for delete
  using (auth.uid() = customer_id);

-- ============================================================
-- bids — one row per notary bid on a job
-- ============================================================
create table if not exists public.bids (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid references public.jobs on delete cascade,
  notary_id  uuid references public.profiles on delete cascade,
  price      numeric,
  message    text,
  status     text default 'pending'
             check (status in ('pending', 'accepted', 'lost')),
  created_at timestamptz default now()
);

alter table public.bids enable row level security;

-- Notaries can insert bids only on open jobs
create policy "bids: notary inserts on open job"
  on public.bids for insert
  with check (
    auth.uid() = notary_id
    and exists (
      select 1 from public.jobs where id = job_id and status = 'open'
    )
  );

-- Customers can read bids placed on their own jobs
create policy "bids: customer reads bids on own job"
  on public.bids for select
  using (
    exists (
      select 1 from public.jobs
      where id = job_id and customer_id = auth.uid()
    )
  );

-- Notaries can read and update their own bids
create policy "bids: notary manages own bids"
  on public.bids for all
  using  (auth.uid() = notary_id)
  with check (auth.uid() = notary_id);

-- ============================================================
-- Circular FK: jobs.accepted_bid_id → bids.id
-- Added last so both tables already exist
-- ============================================================
alter table public.jobs
  add constraint jobs_accepted_bid_id_fkey
  foreign key (accepted_bid_id) references public.bids(id) on delete set null;
