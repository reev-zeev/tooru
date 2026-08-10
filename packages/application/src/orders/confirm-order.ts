/**
 * Purpose: define the application boundary for confirming a quoted order.
 * The concrete implementation must execute the quote validation, payment intent creation,
 * order transition, job creation, and audit write in a transaction/outbox-aware workflow.
 */
import type { Currency } from '../../../domain/src/pricing/price';

export interface ConfirmOrderInput {
  readonly orderId: string;
  readonly quoteId: string;
  readonly customerId: string;
  readonly amountMinor: bigint;
  readonly currency: Currency;
  readonly idempotencyKey: string;
}

export interface OrderConfirmationTransaction {
  confirm(input: ConfirmOrderInput): Promise<{
    orderId: string;
    jobId: string;
    paymentIntentId: string;
    status: 'confirmed';
  }>;
}

export class ConfirmOrder {
  constructor(private readonly transaction: OrderConfirmationTransaction) {}

  execute(input: ConfirmOrderInput) {
    return this.transaction.confirm(input);
  }
}
