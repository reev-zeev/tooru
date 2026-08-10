/**
 * Purpose: define a deterministic quote contract before payment or checkout exists.
 */
import type { Currency, Money } from './price';

export interface QuoteInput {
  readonly service: 'ride' | 'delivery' | 'pickup';
  readonly cityId: string;
  readonly distanceMeters: number;
  readonly durationSeconds: number;
  readonly currency: Currency;
}

export interface Quote {
  readonly currency: Currency;
  readonly subtotal: Money;
  readonly fees: readonly Money[];
  readonly discount: Money;
  readonly total: Money;
  readonly expiresAt: Date;
  readonly pricingVersion: string;
}

export interface PricingPolicy {
  readonly version: string;
  readonly minimum: Money;
  readonly base: Money;
  readonly perKilometer: Money;
  readonly perMinute: Money;
}

export function calculateQuote(input: QuoteInput, policy: PricingPolicy, now = new Date()): Quote {
  if (input.distanceMeters < 0 || input.durationSeconds < 0) throw new Error('Distance and duration cannot be negative');
  if (policy.base.currency !== input.currency || policy.minimum.currency !== input.currency) {
    throw new Error('Pricing policy currency mismatch');
  }

  const km = BigInt(Math.ceil(input.distanceMeters / 1000));
  const minutes = BigInt(Math.ceil(input.durationSeconds / 60));
  const usage = policy.perKilometer.minor * km + policy.perMinute.minor * minutes;
  const subtotalMinor = policy.base.minor + usage;
  const totalMinor = subtotalMinor < policy.minimum.minor ? policy.minimum.minor : subtotalMinor;

  return {
    currency: input.currency,
    subtotal: { minor: totalMinor, currency: input.currency },
    fees: [],
    discount: { minor: 0n, currency: input.currency },
    total: { minor: totalMinor, currency: input.currency },
    expiresAt: new Date(now.getTime() + 5 * 60_000),
    pricingVersion: policy.version,
  };
}
