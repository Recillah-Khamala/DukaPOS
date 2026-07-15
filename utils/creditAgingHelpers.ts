import type { CreditEntry } from '../context/CreditLedgerContext';

export type AgingTier = 'current' | 'aging' | 'atRisk';

export function getEntryAgeDays(entry: CreditEntry): number {
  const created = new Date(entry.createdAt);
  const now = new Date();
  const diffTime = now.getTime() - created.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getAgingTier(ageDays: number): AgingTier {
  if (ageDays < 60) {
    return 'current';
  }
  if (ageDays <= 89) {
    return 'aging';
  }
  return 'atRisk';
}

export function getCustomerAgingTier(customerEntries: CreditEntry[]): AgingTier {
  if (customerEntries.length === 0) {
    // No debt => current
    return 'current';
  }
  // Find oldest entry (earliest createdAt)
  const oldest = customerEntries.reduce((prev, current) => {
    const prevDate = new Date(prev.createdAt).getTime();
    const currDate = new Date(current.createdAt).getTime();
    return prevDate < currDate ? prev : current;
  });
  const age = getEntryAgeDays(oldest);
  return getAgingTier(age);
}

export function isOverdue(entry: CreditEntry): boolean {
  return getAgingTier(getEntryAgeDays(entry)) === 'atRisk';
}

export function isDueSoon(entry: CreditEntry): boolean {
  const age = getEntryAgeDays(entry);
  return age >= 20 && age <= 30;
}

export function getStatusBadge(entry: CreditEntry): string {
  if (entry.status === 'paid') {
    return 'Paid';
  }
  if (isOverdue(entry)) {
    return 'Overdue';
  }
  if (isDueSoon(entry)) {
    return 'Due Soon';
  }
  return 'Active';
}