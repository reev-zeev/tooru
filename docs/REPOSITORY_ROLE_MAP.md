# Repository Role Map

## Purpose
Classify the legacy repositories by the capabilities they contribute to the unified platform. This file prevents accidental duplication and establishes the extraction map for subsequent implementation work.

## Source repositories

### tooru
Role: current synthesis foundation.
Extract: architecture decisions, product model, workspace conventions, API contracts, documentation.
Do not assume complete runtime implementation merely from documentation.

### waslah-platform
Role: backend/business capability source.
Extract: dispatch, financial architecture, payment abstractions, subscriptions, workers, repository boundaries, operational services.

### upaaz-
Role: domain/application architecture source.
Extract: domain entities, state machines, application use cases, ports, and business invariants.

### wily
Role: practical Telegram/operations implementation source.
Extract: driver/customer flows, dispatch claiming, concurrency handling, bot interaction patterns, gateway/worker separation.

### bnnz
Role: engineering governance and foundation source.
Extract: shared package conventions, architectural constraints, testing/CI discipline, city/tenant rules, atomic operation principles.

### vees
Role: multi-surface ecosystem source.
Extract: separation between public API, bots, mini-apps, admin, city operations, schedulers, and worker processes.

### product-genesis
Role: product and modern application architecture source.
Extract: product structure, UI/application composition, domain/application/infrastructure separation, reusable product concepts.

### asraar
Role: operations and UX source.
Extract: role-based experiences, admin/merchant/enterprise/driver/customer views, map and operational concepts.

### wusla-io
Role: strategy/specification source.
Extract: product strategy, domain/data-flow thinking, API/security/operations specifications.

## Selection rule
No repository is designated as the permanent implementation base solely because of its name or apparent maturity. Components are promoted according to evidence: correctness, domain fidelity, concurrency safety, security, testability, operability, scalability, and suitability for the unified target.

## Promotion rule
A legacy component may be copied, adapted, or rewritten only after its behavior and dependencies are understood. The target repository owns the final architecture; legacy architecture must not dictate it when it conflicts with the unified platform rules.
