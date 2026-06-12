-- Customer counter-offer on a notary's pending bid.
alter table public.bids
  add column if not exists customer_counter_price   numeric,
  add column if not exists customer_counter_message text,
  add column if not exists customer_counter_at      timestamptz;
