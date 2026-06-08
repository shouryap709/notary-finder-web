-- ============================================================
-- Bid-ceiling trigger for NotaryFinder
--
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--
-- Effect: any INSERT or UPDATE on public.bids where
--   price >= the job's starting_price is rejected with a
--   clear error message. Fires server-side so it cannot be
--   bypassed by client code.
-- ============================================================

CREATE OR REPLACE FUNCTION check_bid_under_ceiling()
RETURNS TRIGGER AS $$
DECLARE
  job_ceiling numeric;
BEGIN
  SELECT starting_price INTO job_ceiling FROM public.jobs WHERE id = NEW.job_id;
  IF job_ceiling IS NULL THEN
    RAISE EXCEPTION 'Job % not found', NEW.job_id;
  END IF;
  IF NEW.price >= job_ceiling THEN
    RAISE EXCEPTION 'Bid price % must be strictly less than job ceiling %',
      NEW.price, job_ceiling;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop first so re-running this file is safe
DROP TRIGGER IF EXISTS enforce_bid_ceiling ON public.bids;

CREATE TRIGGER enforce_bid_ceiling
  BEFORE INSERT OR UPDATE ON public.bids
  FOR EACH ROW EXECUTE FUNCTION check_bid_under_ceiling();
