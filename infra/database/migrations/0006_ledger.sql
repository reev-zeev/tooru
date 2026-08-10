-- Purpose: create the financial ledger and payment intents. Monetary state is append-oriented and auditable.
create table if not exists payment_intents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  provider text not null,
  provider_reference text,
  status text not null check (status in ('created','authorized','captured','failed','cancelled','refunded')),
  amount_minor bigint not null check (amount_minor >= 0),
  currency_code text not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ledger_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references actors(id),
  reference_id uuid not null,
  entry_type text not null check (entry_type in ('charge','capture','refund','fee','payout','adjustment')),
  amount_minor bigint not null check (amount_minor >= 0),
  currency_code text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_payment_order on payment_intents(order_id, created_at desc);
create index if not exists idx_ledger_account_time on ledger_entries(account_id, occurred_at desc);
create index if not exists idx_ledger_reference on ledger_entries(reference_id);
