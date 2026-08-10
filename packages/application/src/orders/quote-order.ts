/**
 * Purpose: turn an order request into a short-lived, versioned quote without coupling to payment providers.
 */
import { calculateQuote, type PricingPolicy } from '../../../domain/src/pricing/quote';
import type { Currency } from '../../../domain/src/pricing/price';

export interface QuoteOrderInput {
  service: 'ride' | 'delivery' | 'pickup';
  cityId: string;
  distanceMeters: number;
  durationSeconds: number;
  currency: Currency;
}

export class QuoteOrder {
  constructor(private readonly policyForCity: (cityId: string, service: QuoteOrderInput['service']) => PricingPolicy) {}

  execute(input: QuoteOrderInput) {
    const policy = this.policyForCity(input.cityId, input.service);
    return calculateQuote(input, policy);
  }
}
