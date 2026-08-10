# Architecture Governance

## Purpose
Explain why this repository exists and how architectural decisions are governed while legacy projects are synthesized into one platform.

## Non-negotiable boundaries
- `domain` contains business concepts and invariants and must not depend on transport, database clients, UI, or external providers.
- `application` orchestrates use cases and depends on ports/interfaces rather than concrete infrastructure.
- `infrastructure` implements persistence, messaging, geospatial, payments, notifications, and external integrations.
- `interfaces` expose application capabilities through HTTP, bots, webhooks, jobs, or other channels.
- `workers` execute asynchronous workloads and must be retry-safe.
- `ops` and administrative surfaces may orchestrate privileged use cases but may not bypass domain invariants.

## Data authority
PostgreSQL is the source of truth for transactional state. Redis or other caches are acceleration layers and never the authoritative source for financial balances, ownership, or final job state.

## Concurrency authority
Critical transitions must be protected by transactional constraints, row locks, compare-and-set semantics, unique constraints, or atomic database procedures as appropriate. A UI check is never a concurrency control mechanism.

## Financial authority
Financial records form an append-oriented ledger. Derived balances are rebuildable. Every external payment event is idempotently mapped to an internal transaction and reconciled.

## Geography authority
Countries, cities, service areas, currencies, time zones, languages, operating policies, and feature availability are configuration/data. Launch cities are not special cases in domain code.

## Channel authority
Channels translate user interactions into application commands and render results. They do not implement dispatch, pricing, settlement, authorization policy, or other core business decisions independently.

## Change policy
Prefer the smallest coherent change that preserves invariants. Reuse legacy code only after reviewing its contracts and failure behavior. Rewrite code when extraction would preserve obsolete coupling or weaken the target architecture.

## Required documentation
Every new top-level directory and every significant package must contain a local README explaining its purpose, ownership boundary, dependencies, and extension rules. Significant architectural choices require an ADR.
