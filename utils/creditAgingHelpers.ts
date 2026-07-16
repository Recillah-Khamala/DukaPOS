import type { CreditEntry } from '../hooks/useCreditLedger';

export type AgingTier = 'current' | 'aging' | 'atRisk';

// Aged from createdAt (when the debt was incurred), not lastUpdatedAt —
// standard accounts-receivable-aging convention. A debt with small
// trickle payments is still "old" if it originated long ago.
export function getEntryAgeDays(entry: CreditEntry): number {
  const createdAt = new Date(entry.createdAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)));
}

export function getAgingTier(ageDays: number): AgingTier {
  if (ageDays >= 90) return 'atRisk';
  if (ageDays >= 60) return 'aging';
  return 'current';
}

// A customer's risk is driven by their oldest unresolved debt, not their
// newest — so this looks at the entry with the earliest createdAt among
// the customer's active entries.
export function getCustomerAgingTier(customerEntries: CreditEntry[]): AgingTier {
  if (customerEntries.length === 0) return 'current';
  const oldest = customerEntries.reduce((oldestSoFar, entry) =>
    new Date(entry.createdAt).getTime() < new Date(oldestSoFar.createdAt).getTime() ? entry : oldestSoFar
  );
  return getAgingTier(getEntryAgeDays(oldest));
}