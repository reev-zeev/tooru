/**
 * Purpose: provide an exact, currency-aware money primitive for pricing and settlement.
 * Never use floating-point arithmetic for monetary values.
 */
export type Currency = 'SAR' | 'AED' | 'BHD' | 'KWD' | 'OMR' | 'QAR' | 'JOD' | 'IQD' | 'TRY' | 'EGP';

export interface Money {
  readonly minor: bigint;
  readonly currency: Currency;
}

export function money(minor: bigint | number, currency: Currency): Money {
  const value = typeof minor === 'number' ? BigInt(minor) : minor;
  return { minor: value, currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error('Cannot add different currencies');
  return money(a.minor + b.minor, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error('Cannot subtract different currencies');
  return money(a.minor - b.minor, a.currency);
}

export function zeroMoney(currency: Currency): Money {
  return money(0n, currency);
}
