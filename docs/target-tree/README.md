# Target Repository Tree

## Purpose
This directory documents the intended repository shape before large-scale implementation begins. The target tree is deliberately domain-first and channel-agnostic.

## Target top-level structure

```text
apps/
  api/
  admin/
  web/
  telegram/
  workers/

packages/
  domain/
    identity/
    geography/
    actors/
    catalog/
    orders/
    mobility/
    dispatch/
    pricing/
    payments/
    subscriptions/
    safety/
    support/
    notifications/
    audit/
  application/
    commands/
    queries/
    services/
    ports/
  infrastructure/
    database/
    cache/
    queue/
    geo/
    payments/
    messaging/
    storage/
    observability/
  interfaces/
    http/
    telegram/
    web/
    partner-api/
  shared/
    config/
    errors/
    result/
    ids/
    time/
    validation/

infra/
  database/
    migrations/
    seeds/
    functions/
  deployment/
  observability/
  security/

config/
  countries/
  cities/
  services/
  pricing/
  policies/

packages/testing/
  fixtures/
  builders/
  contract/

scripts/

docs/
  architecture/
  adr/
  operations/
  launch/
  api/
```

The tree is a target architecture, not permission to create empty folders indiscriminately. A directory becomes implementation-bearing when its contract and first real capability are ready.
