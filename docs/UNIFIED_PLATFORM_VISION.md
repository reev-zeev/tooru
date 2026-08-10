# Unified Platform Vision

## Purpose
This document defines the target architecture for the unified logistics platform synthesized from the project's legacy repositories. It is an engineering source of truth, not a marketing document.

## Mission
Build a real, multi-tenant logistics and mobility platform capable of serving Gulf, Levant, Iraq, Turkey, and Egypt, with a Saudi commercial launch centered on Riyadh, Jeddah, Makkah, Taif, Madinah, and Dammam.

## Product principle
The business domain is channel-agnostic. Telegram, WhatsApp, web, mobile apps, Discord, partner APIs, and future channels are adapters around the same domain and application services.

## Core domains
- Identity and access
- Organizations, merchants, enterprises, and drivers
- Customers and addresses
- Cities, service areas, geospatial data, and localization
- Orders, rides, deliveries, and multi-stop jobs
- Dispatch, matching, offers, claims, reassignment, and expiry
- Pricing, quotes, fees, wallets, payments, invoices, subscriptions, and settlements
- Driver onboarding, KYC, vehicles, availability, and safety
- Notifications and communication channels
- Customer support, disputes, fraud, risk, and audit
- Operations, city management, analytics, reporting, and administration
- Partner APIs and integrations

## Architectural rules
1. Domain logic never depends on a channel or UI framework.
2. Critical state transitions are authoritative at the database/domain boundary and must be concurrency-safe.
3. Money movement is ledger-based, idempotent, auditable, and never inferred from UI state.
4. Every operationally significant mutation emits an auditable event.
5. City/country configuration is data, not duplicated application code.
6. External providers are ports/adapters and must be replaceable.
7. Async work is explicit, retryable, observable, and idempotent.
8. Security, privacy, rate limits, authorization, and tenant isolation are first-class architecture concerns.
9. No feature is considered implemented until its production path, tests, configuration, and operational behavior exist.
10. The system must scale horizontally without relying on process-local state.

## Launch geography
Initial commercial launch cities:
- Riyadh
- Jeddah
- Makkah
- Taif
- Madinah
- Dammam

The platform model must already support the wider target geography through configuration and data models, without hard-coding the launch cities into business logic.

## Delivery strategy
Build the shared platform core first, then activate Saudi launch capabilities, then expand country/city configuration and provider adapters. Legacy repositories are source material: their strongest domain rules, dispatch algorithms, financial controls, UX patterns, and engineering safeguards should be extracted and rebuilt where necessary rather than copied blindly.

## Repository policy
This branch is the synthesis foundation. Legacy repositories remain historical sources until their code has been classified, tested, and deliberately promoted into the unified platform.
