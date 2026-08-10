-- Purpose: provide a durable idempotency boundary for commands that can be retried by clients, queues, or webhooks.
create table if not exists idempotency_keys (
  key text primary key,
  actor_id uuid references actors(id),
  operation text not null,
  request_hash text not null,
  response_status integer,
  response_body jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists idx_idempotency_expiry on idempotency_keys(expires_at);
