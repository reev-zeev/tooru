/**
 * Purpose: centralize cancellation policy so channels cannot invent inconsistent cancellation rules.
 */
export type CancellationReason =
  | 'customer_request'
  | 'driver_request'
  | 'no_driver'
  | 'payment_failure'
  | 'safety'
  | 'operator';

export interface CancellationDecision {
  readonly allowed: boolean;
  readonly refundEligible: boolean;
  readonly reason: CancellationReason;
}

export function decideCancellation(status: string, reason: CancellationReason): CancellationDecision {
  if (status === 'completed' || status === 'cancelled') {
    return { allowed: false, refundEligible: false, reason };
  }

  const refundEligible = status === 'confirmed' || status === 'assigned';
  return { allowed: true, refundEligible, reason };
}
