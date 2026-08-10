# Orders and Jobs

Purpose: define the platform's unified work model. A job can represent a ride, delivery, pickup/drop-off task, or a future logistics service without forcing each channel to implement its own lifecycle.

The job lifecycle is authoritative domain behavior. Dispatch, payment, notifications, and UI consume job state; they do not invent alternate states.
