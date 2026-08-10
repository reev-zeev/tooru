# Geography Domain

Purpose: model countries, cities, service areas, coordinates, operating zones, and geographic policy without coupling the platform to a single country or launch market.

Why it exists: the platform must begin in six Saudi cities while being structurally capable of expanding across the Gulf, Levant, Iraq, Turkey, Egypt, and Yemen. Geography is therefore domain data and policy, not a collection of hard-coded conditionals.

Rules:
- Coordinates are validated domain values.
- Country/city identity is stable and independent of display language.
- Service areas are explicit operational boundaries.
- A city can be enabled/disabled without changing application code.
