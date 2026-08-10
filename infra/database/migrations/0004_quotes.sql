-- Purpose: persist immutable quote snapshots so a customer sees and confirms a stable commercial offer.
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  pricing_version text not null,
  currency_code text not null,
  subtotal_minor bigint not null,
  discount_minor bigint not null default 0,
  total_minor bigint not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_quotes_order_created on quotes(order_id, created_at desc);
