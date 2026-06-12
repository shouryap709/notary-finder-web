-- Reusable customer addresses (Home, Office, etc).
create table if not exists public.customer_saved_addresses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  label       text not null,
  address     text not null,
  lat         numeric,
  lng         numeric,
  created_at  timestamptz not null default now()
);

create index if not exists customer_saved_addresses_customer_idx
  on public.customer_saved_addresses(customer_id);

alter table public.customer_saved_addresses enable row level security;

create policy "Customer manages own addresses"
  on public.customer_saved_addresses for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);
