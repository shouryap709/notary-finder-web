-- Customer reward tiers
-- Adds a `tier` column to profiles and recomputes it from completed-job spend
-- whenever a review is inserted (a review implies a completed job).

alter table profiles
  add column if not exists tier text default 'standard'
  check (tier in ('standard', 'silver', 'gold', 'platinum'));

-- Recompute a single customer's tier from the sum of their completed job prices.
create or replace function recompute_customer_tier(p_customer uuid)
returns void
language plpgsql
as $$
declare
  total numeric;
  new_tier text;
begin
  select coalesce(sum(coalesce(b.price, j.suggested_price, j.starting_price)), 0)
    into total
  from jobs j
  left join bids b on b.id = j.accepted_bid_id
  where j.customer_id = p_customer
    and j.status = 'completed';

  if    total >= 2000 then new_tier := 'platinum';
  elsif total >= 500  then new_tier := 'gold';
  elsif total >= 100  then new_tier := 'silver';
  else                     new_tier := 'standard';
  end if;

  update profiles set tier = new_tier where id = p_customer;
end;
$$;

-- After a review lands, recompute the reviewing customer's tier.
create or replace function trg_recompute_tier_on_review()
returns trigger
language plpgsql
as $$
begin
  perform recompute_customer_tier(new.customer_id);
  return new;
end;
$$;

drop trigger if exists reviews_recompute_tier on reviews;
create trigger reviews_recompute_tier
  after insert on reviews
  for each row
  execute function trg_recompute_tier_on_review();
