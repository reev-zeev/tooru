-- Purpose: persist immutable operational audit events for traceability and incident investigation.
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_id uuid references actors(id),
  aggregate_id uuid not null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_aggregate on audit_events(aggregate_id, occurred_at desc);
create index if not exists idx_audit_type_time on audit_events(event_type, occurred_at desc);
