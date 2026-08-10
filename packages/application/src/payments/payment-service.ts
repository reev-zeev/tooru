/**
 * Purpose: define the application payment boundary. Provider SDKs are adapters; this service owns platform intent semantics.
 */
import type { Currency } from '../../../domain/src/pricing/price';

export interface PaymentProvider {
  createIntent(input: { amountMinor: bigint; currency: Currency; idempotencyKey: string }): Promise<{
    providerReference: string;
    status: 'created' | 'authorized' | 'failed';
  }>;
}

export interface PaymentIntentRepository {
  create(input: {
    orderId: string;
    provider: string;
    amountMinor: bigint;
    currency: Currency;
    idempotencyKey: string;
  }): Promise<void>;
}

export class CreatePaymentIntent {
  constructor(
    private readonly providerName: string,
    private readonly provider: PaymentProvider,
    private readonly intents: PaymentIntentRepository,
  ) {}

  async execute(input: { orderId: string; amountMinor: bigint; currency: Currency; idempotencyKey: string }) {
    await this.intents.create({ ...input, provider: this.providerName });
    return this.provider.createIntent(input);
  }
}
