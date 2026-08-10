# Dispatch domain

Purpose: own driver eligibility and dispatch decision rules. Geospatial lookup, persistence, queues, notifications, and external map providers are infrastructure/application concerns and must remain outside this package.

Dispatch must be designed for very high contention: many eligible drivers may race for the same job. Final assignment is an atomic state transition at the persistence boundary, not a decision made solely in memory.
