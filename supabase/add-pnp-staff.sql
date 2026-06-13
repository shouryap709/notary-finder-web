-- Print N' Parcel staff flag — grants access to the internal staff dashboard.
alter table public.profiles
  add column if not exists is_pnp_staff boolean default false;
