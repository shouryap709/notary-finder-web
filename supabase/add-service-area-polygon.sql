-- Notary service area as a polygon of [lat, lng] vertices.
-- When set, the feed uses point-in-polygon instead of max_travel_mi.
alter table public.profiles
  add column if not exists service_area_polygon jsonb;
