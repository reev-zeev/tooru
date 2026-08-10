# HTTP interface

Purpose: expose the application layer through an HTTP transport without placing business rules in route handlers.

Authentication, authorization, request validation, idempotency, rate limiting, and response mapping belong at this boundary; order, pricing, dispatch, and payment decisions belong to application/domain services.
