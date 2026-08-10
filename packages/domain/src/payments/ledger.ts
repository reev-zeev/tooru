/**
 * Purpose: define the immutable financial ledger contract. Balances are derived from entries; providers never become the financial source of truth.
 */
import type { Currency } from '../pricing/price';

export type LedgerEntryType = 'charge' | 'capture' | 'refund' | 'fee' | 'payout' | 'adjustment';

export interface LedgerEntry {
  readonly id: string;
  readonly accountId: string;
  readonly referenceId: string;
  readonly type: LedgerEntryType;
  readonly amountMinor: bigint;
  readonly currency: Currency;
  readonly occurredAt: Date;
  readonly metadata: Readonly<Record<string, string>>;
}

export function assertPositiveEntry(entry: LedgerEntry): void {
  if (entry.amountMinor < 0n) throw new Error('Ledger entry amount cannot be negative');
}
