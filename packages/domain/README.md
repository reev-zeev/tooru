# Domain

Purpose: own the platform's business language, invariants, state machines, value objects, and domain events. This package must remain independent from HTTP, Telegram, UI frameworks, database clients, and external vendors.

The domain is the stable center of the platform. Country and channel differences must be represented as policies/configuration or adapters rather than duplicated domain implementations.
