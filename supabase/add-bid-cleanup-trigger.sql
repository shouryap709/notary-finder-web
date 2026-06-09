-- Auto-decline competing bids when one bid is accepted
create or replace function decline_competing_bids()
returns trigger as $$
begin
  if NEW.status = 'accepted' and OLD.status is distinct from 'accepted' then
    update public.bids
       set status = 'lost'
     where job_id = NEW.job_id
       and id <> NEW.id
       and status = 'pending';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger bids_auto_decline_others
  after update on public.bids
  for each row execute function decline_competing_bids();

-- Add 'cancelled' as a valid bid status
alter table public.bids drop constraint if exists bids_status_check;
alter table public.bids add constraint bids_status_check
  check (status in ('pending', 'accepted', 'lost', 'cancelled'));
