# Commercial Launch Readiness

Purpose: define the minimum release gate for moving Waslah from foundation code to a commercial launch. This document is intentionally strict: a launch is not approved until every gate has an accountable owner, automated evidence, and a rollback path.

## Launch posture

The current repository contains the domain, application, and database foundation for a regional logistics platform. It is not yet a complete commercial product because the API composition root, worker runtime, customer/merchant/admin channels, concrete infrastructure adapters, and production deployment automation are still expected to be implemented under the target architecture.

## Non-negotiable launch gates

| Gate | Required evidence | Owner |
| --- | --- | --- |
| Identity and authorization | Role-based access checks on every command/query and admin action | Security lead |
| Payments and ledger | Provider reconciliation, immutable ledger entries, refund policy tests, and idempotent payment webhooks | Payments lead |
| Dispatch correctness | Database-level job claim guarantees, offer expiry workers, retry policy, and load-tested driver matching | Dispatch lead |
| Observability | RED metrics, audit events, traces, dashboards, and paging alerts for all critical flows | SRE lead |
| Data protection | Secret scanning, encrypted backups, retention policy, PII access audit, and incident playbook | Security lead |
| Operational support | Admin tooling, customer support workflows, manual compensation flow, and escalation paths | Operations lead |
| Legal and compliance | Terms, privacy policy, payment provider compliance, and country-specific operating approvals | Commercial lead |
| Release management | Staged rollout, feature flags, canary deploys, rollback drills, and migration dry-runs | Engineering lead |

## Saudi launch scope

The first commercial launch remains scoped to Riyadh, Jeddah, Makkah, Taif, Madinah, and Dammam. Geography must remain configuration-driven, matching the platform rule that country and city behavior is data, not hard-coded branching.

## Definition of done for public launch

1. All launch gates above are marked green with linked evidence.
2. Production and staging environments are created from the same infrastructure templates.
3. Database migrations have been rehearsed against a production-sized clone.
4. The worker fleet can drain, replay, and retry outbox events without data loss.
5. Synthetic journeys cover quote, confirm, payment authorization, dispatch, completion, cancellation, refund, and support escalation.
6. On-call rotations, SLO dashboards, and incident response runbooks are active before marketing traffic begins.
7. Load testing proves the capacity targets in `docs/operations/SCALE_RUNBOOK.md` with at least 30% headroom.

## Explicit non-goals for this repository state

- Do not treat this repository as launch-approved solely because it has database migrations or domain models.
- Do not accept one million concurrent users without a measured workload model, horizontal autoscaling, back-pressure, regional capacity planning, and operational staffing.
- Do not store provider credentials, tokens, or environment secrets in source control.
