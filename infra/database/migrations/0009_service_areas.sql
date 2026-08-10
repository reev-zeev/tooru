-- Purpose: represent operational coverage independently from the city entity.
create table if not exists service_areas (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  name text not null,
  boundary jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(city_id, name)
);

create table if not exists service_area_services (
  service_area_id uuid not null references service_areas(id) on delete cascade,
  service text not null check (service in ('ride','delivery','pickup')),
  active boolean not null default true,
  primary key(service_area_id, service)
);
