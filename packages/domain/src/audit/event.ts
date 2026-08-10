/**
 * Purpose: define the immutable shape of operational audit events.
 * Audit events record significant business mutations independently from application logs.
 */
export type AuditEventType =
  | 'order.created'
  | 'order.status_changed'
  | 'dispatch.offer_created'
  | 'dispatch.claimed'
  | 'dispatch.expired'
  | 'payment.created'
  | 'payment.completed'
  | 'payment.failed';

export interface AuditEvent {
  readonly id: string;
  readonly type: AuditEventType;
  readonly actorId?: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly metadata: Readonly<Record<string, string | number | boolean | null>>;
}
