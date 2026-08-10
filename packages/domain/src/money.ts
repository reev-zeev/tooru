import type { MoneyMinor } from "@waslah/shared/ids";

export interface Money {
  readonly currency: string;
  readonly minor: MoneyMinor;
}

export const createMoney = (currency: string, minor: bigint): Money => {
  const normalized = currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) throw new Error("Invalid ISO 4217 currency code");
  return { currency: normalized, minor: minor as MoneyMinor };
};

export const addMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new Error("Currency mismatch");
  return { currency: a.currency, minor: (a.minor + b.minor) as MoneyMinor };
};
