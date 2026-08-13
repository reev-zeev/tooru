# Scale Runbook: One Million Concurrent Users

Purpose: translate the business target of more than one million concurrent users into concrete engineering controls, capacity assumptions, and operational procedures.

## Capacity target

The platform target is **1,000,000+ concurrent users** across customer, driver, merchant, enterprise, bot, and admin channels. Capacity approval requires measured throughput, not only replica counts.

Recommended initial sizing assumptions for tests:

- 1,000,000 concurrent connected users.
- 50,000 active drivers sending location updates every 5 seconds at peak.
- 8,000 order quote requests per second.
- 2,000 order confirmations per second.
- 2,000 dispatch waves per second.
- 20,000 notification sends per second through asynchronous workers.
- 99th percentile API latency under 300 ms for read paths and under 700 ms for write paths, excluding external provider latency.

These assumptions must be replaced with measured production traffic after launch.

## Architecture controls

1. **Stateless API replicas**: all public API pods must be horizontally scalable and must not rely on process-local state for correctness.
2. **Database as transactional authority**: order state, job ownership, idempotency, ledger entries, and outbox publication remain protected by PostgreSQL constraints and transactions.
3. **Asynchronous fan-out**: notifications, provider webhooks, analytics, and audit shipping flow through queues/outbox workers rather than synchronous request fan-out.
4. **Back-pressure**: API, worker, and bot adapters must reject or defer work when queues, database pools, or provider budgets are saturated.
5. **Regional isolation**: launch cities should be partitionable by city/country routing keys so a hot city does not starve the whole platform.
6. **Cache discipline**: caches can accelerate reads and driver discovery but cannot become the source of truth for money, ownership, or lifecycle transitions.

## Minimum production topology

| Component | Baseline | Autoscaling signal |
| --- | --- | --- |
| API | 6 pods across 3 zones | CPU, p95 latency, request queue depth |
| Workers | 6 pods across 3 zones | queue lag, outbox age, retry rate |
| Bot/channel adapters | 3 pods per critical channel | inbound backlog and webhook latency |
| PostgreSQL | managed multi-AZ primary with read replicas | connections, locks, IOPS, replication lag |
| Redis/cache | clustered or managed HA | memory, evictions, command latency |
| Queue | managed HA queue or stream | consumer lag, publish failures |

## Load-test phases

1. **Smoke**: one complete synthetic journey per city.
2. **Baseline**: expected launch traffic for 30 minutes.
3. **Peak**: 2x launch traffic for 60 minutes.
4. **Soak**: expected launch traffic for 12 hours.
5. **Failure**: provider timeout, worker crash, database failover, queue backlog, and one-zone outage drills.

## Operational alerts

Page immediately when any of the following persist for 5 minutes:

- API 5xx rate exceeds 1%.
- p99 write latency exceeds 1 second.
- Payment webhook processing lag exceeds 2 minutes.
- Outbox oldest unpublished event exceeds 60 seconds.
- Dispatch claim conflict rate spikes above historical baseline by 3x.
- Database connection saturation exceeds 85%.
- Queue lag threatens SLA breach for notifications or dispatch.

## Release procedure

1. Apply migrations in staging from a clean restore and from the previous production version.
2. Run smoke journeys for each launch city.
3. Deploy canary API and worker replicas at 5% traffic.
4. Watch SLO dashboards and error budgets for 30 minutes.
5. Increase traffic to 25%, 50%, then 100% only if alerts remain green.
6. Keep the previous image available for immediate rollback.
7. Freeze schema-destructive migrations until after the launch stabilization window.

## Rollback procedure

1. Stop traffic promotion and disable the changed feature flag.
2. Scale down affected workers if they are producing bad side effects.
3. Roll API/channel adapters back to the previous image.
4. Keep idempotent compensating jobs for payment, notification, and dispatch side effects.
5. Capture incident timeline, customer impact, and follow-up actions.
