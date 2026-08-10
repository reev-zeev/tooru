# Engineering Rules

1. Domain code never imports transport, UI, ORM, cache, queue, or provider SDKs.
2. Application use cases are the only common execution surface for channels.
3. Database transactions and constraints protect critical state transitions.
4. Money is represented by immutable ledger entries and idempotent transactions.
5. Caches are never the financial or ownership source of truth.
6. External providers are ports/adapters and replaceable.
7. Asynchronous jobs are retryable and idempotent.
8. Geography is configuration/data, not hard-coded business branches.
9. Every meaningful mutation is observable and auditable where appropriate.
10. No feature is complete without tests, validation, authorization, failure handling, and operational behavior.
11. Secrets never live in source control.
12. The system must scale horizontally and must not depend on process-local state for correctness.
