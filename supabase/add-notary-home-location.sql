alter table public.profiles
  add column if not exists home_address  text,
  add column if not exists home_lat       numeric,
  add column if not exists home_lng       numeric,
  add column if not exists max_travel_mi  int default 25;
