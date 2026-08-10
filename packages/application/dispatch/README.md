# Dispatch Application Capability

Purpose: define the application-level boundary for turning a requested job into a safe driver assignment. Dispatch will combine geographic eligibility, driver availability, service policy, ranking, offer lifecycle, claiming, expiry, reassignment, and observability.

The application layer owns orchestration; database/infrastructure implementations provide atomic persistence and geospatial capabilities. No channel may implement dispatch independently.
