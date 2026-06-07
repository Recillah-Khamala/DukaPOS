import type { UnitType, FractionLabel, FractionPrice } from '../types';

export function formatQty(qty: number): string {
  if (qty === 0.125) return '1/8';
  if (qty === 0.25) return '1/4';
  if (qty === 0.5) return '1/2';
  if (Number.isInteger(qty)) return String(qty);
  return qty.toFixed(3).replace(/\.?0+$/, '');
}

export function roundToNearest5(n: number): number {
  return Math.round(n / 5) * 5;
}

export function formatUnitQty(
  qty: number,
  unitType: UnitType,
  unitLabel: string,
  fractionLabel?: FractionLabel,
  variantLabel?: string
): string {
  if (unitType === 'bag_size') {
    return `${qty} × ${variantLabel}`;
  }
  if (unitType === 'korokoro' || unitType === 'kg') {
    return fractionLabel ? `${fractionLabel} ${unitLabel}` : `${qty} ${unitLabel}`;
  }
  if (unitType === 'piece') {
    return `${qty} × ${unitLabel}`;
  }
  return `${qty} ${unitLabel}`;
}

export function formatPriceRange(fractionPrices: FractionPrice[]): string {
  if (fractionPrices.length === 0) return '';
  const prices = fractionPrices.map((fp) => fp.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return `${min} – ${max} KES`;
}

export function formatLineTotal(qty: number, unitPrice: number): string {
  const total = roundToNearest5(qty * unitPrice);
  return `${total} KES`;
}