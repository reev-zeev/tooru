# Target Architecture

The repository is organized as one platform, not a collection of applications copied together.

```text
apps/
  api/                 HTTP/public API composition root
  admin/               privileged operations console
  web/                 customer/merchant web channel
  bots/                channel adapters (Telegram/other bots)
  workers/             asynchronous execution

packages/
  domain/              business truth and invariants
  application/         commands, queries, orchestration
  infrastructure/      concrete persistence/provider adapters
  interfaces/          transport adapters and contracts
  shared/              safe cross-cutting primitives

data/
  countries/           country configuration
  cities/              city/service-area configuration

infra/
  database/             migrations, functions, seeds
  deployment/           deployment definitions
  observability/        metrics, logs, tracing
  security/             security policies and controls

docs/
  architecture/        architectural source of truth
  domains/              domain specifications
  operations/            operational runbooks
  launch/               launch readiness
```

Every significant directory has its own README explaining why it exists, what it owns, and what it must not own.
