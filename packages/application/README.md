# Application

Purpose: implement business use cases as orchestration over the domain and infrastructure ports. Commands and queries belong here; transport handlers must translate requests into these use cases rather than implement business rules themselves.

This layer is the common execution surface for every channel: web, mobile, Telegram, WhatsApp, partner APIs, admin tools, and background workers.
