-- Purpose: add operational driver lifecycle state and a PostgreSQL-safe location representation.
-- A future geospatial extension may replace the scalar coordinates with PostGIS without changing domain contracts.

alter table driver_profiles
  add column if not exists status text not null default 'pending_verification'
    check (status in ('pending_verification','active','suspended','deactivated'));

create index if not exists idx_driver_dispatch_state
  on driver_profiles(city_id, status, available);

create table if not exists driver_status_events (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references actors(id),
  previous_status text,
  new_status text not null,
  reason text,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_driver_status_events_driver_time
  on driver_status_events(driver_id, occurred_at desc);
