-- Purpose: establish the transactional PostgreSQL foundation for actors, cities, orders, jobs, and dispatch claims.
-- This migration is intentionally provider-light SQL so the same invariants remain portable across PostgreSQL deployments.

create extension if not exists pgcrypto;

create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  currency_code text not null,
  timezone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references countries(id),
  code text not null,
  name text not null,
  timezone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(country_id, code)
);

create table if not exists actors (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('customer','driver','merchant','enterprise','operator','admin')),
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists driver_profiles (
  actor_id uuid primary key references actors(id) on delete cascade,
  city_id uuid not null references cities(id),
  available boolean not null default false,
  latitude numeric(9,6),
  longitude numeric(9,6),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references actors(id),
  city_id uuid not null references cities(id),
  kind text not null check (kind in ('delivery','pickup','ride')),
  status text not null check (status in ('draft','quoted','confirmed','assigned','in_progress','completed','cancelled')),
  currency_code text not null,
  total_minor bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  status text not null check (status in ('pending','offering','assigned','in_progress','completed','cancelled','expired')),
  assigned_driver_id uuid references actors(id),
  version bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dispatch_offers (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  driver_id uuid not null references actors(id),
  status text not null check (status in ('offered','accepted','rejected','expired','cancelled')),
  idempotency_key text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(job_id, driver_id),
  unique(idempotency_key)
);

create unique index if not exists one_active_job_per_driver
  on jobs(assigned_driver_id)
  where status in ('assigned','in_progress');

create index if not exists idx_driver_city_available on driver_profiles(city_id, available);
create index if not exists idx_jobs_dispatchable on jobs(status, created_at);
create index if not exists idx_offers_expiry on dispatch_offers(status, expires_at);

-- Purpose: atomically claim a job. Concurrent callers cannot both become the owner.
create or replace function claim_job(p_job_id uuid, p_driver_id uuid, p_idempotency_key text)
returns text
language plpgsql
as $$
declare
  current_driver uuid;
  current_status text;
begin
  if exists (select 1 from dispatch_offers where idempotency_key = p_idempotency_key and status = 'accepted') then
    return 'claimed';
  end if;

  select assigned_driver_id, status
    into current_driver, current_status
    from jobs
    where id = p_job_id
    for update;

  if not found then
    return 'not_available';
  end if;

  if current_status in ('assigned','in_progress','completed','cancelled','expired') then
    if current_driver = p_driver_id then return 'already_claimed'; end if;
    return 'not_available';
  end if;

  update jobs
     set assigned_driver_id = p_driver_id,
         status = 'assigned',
         version = version + 1,
         updated_at = now()
   where id = p_job_id;

  update dispatch_offers
     set status = case when driver_id = p_driver_id then 'accepted' else 'cancelled' end
   where job_id = p_job_id and status = 'offered';

  return 'claimed';
end;
$$;
