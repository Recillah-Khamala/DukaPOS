// utils/creditEntryHelpers.ts
import type { BasketItem } from '../types';
import type { CreditItemCategory } from '../hooks/useCreditLedger';

/**
 * Maps a credit-ledger category onto BasketItem's narrower type union.
 *
 * Note: 'other' has no direct equivalent in BasketItem.type, so it defaults
 * to 'cereal' — the least-wrong fallback for this shop. This means any
 * credit item tagged "Other" will appear grouped under cereal in Reports'
 * fastest-moving-items list. Revisit if BasketItem.type ever grows an
 * 'other'/'misc' option.
 */
export const categoryToBasketType = (category: CreditItemCategory): BasketItem['type'] => {
  switch (category) {
    case 'milling':
      return 'service';
    case 'bags':
      return 'bag';
    case 'cereal':
    case 'other':
    default:
      return 'cereal';
  }
};

/**
 * Parses a DD/MM/YYYY string (as three separate fields) into an ISO date string.
 * Falls back to "now" if the input is missing or malformed, rather than
 * blocking save — an approximate old date is still better than none for a
 * legacy debt entry.
 */
export const parseManualDate = (day: string, month: string, year: string): string => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y || y < 2000 || m < 1 || m > 12 || d < 1 || d > 31) {
    return new Date().toISOString();
  }
  const parsed = new Date(y, m - 1, d);
  if (isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
};