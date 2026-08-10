-- Purpose: guarantee reliable publication of domain/application events after database transactions.
-- Consumers must process events idempotently.
create table if not exists outbox_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  aggregate_id uuid not null,
  payload jsonb not null,
  available_at timestamptz not null default now(),
  published_at timestamptz,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_outbox_pending on outbox_events(available_at, created_at)
  where published_at is null;

create index if not exists idx_outbox_aggregate on outbox_events(aggregate_id, created_at);
