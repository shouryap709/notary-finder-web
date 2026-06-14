-- Notary weekly business hours. Each day is [openHour, closeHour] or null (closed).
alter table public.profiles
  add column if not exists business_hours jsonb
  default '{"mon":[9,17],"tue":[9,17],"wed":[9,17],"thu":[9,17],"fri":[9,17],"sat":null,"sun":null}'::jsonb;
