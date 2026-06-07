import type { BagType, BagSize } from '../constants/bagData';

export function formatQty(qty: number): string {
  // Handle common fractions
  if (qty === 0.125) return '1/8';
  if (qty === 0.25) return '1/4';
  if (qty === 0.5) return '1/2';
  
  // Handle whole numbers
  if (Number.isInteger(qty)) return String(qty);
  
  // Handle other decimals (up to 3 decimal places, remove trailing zeros)
  return qty.toFixed(3).replace(/\.?0+$/, '');
}

export function formatLineTotal(qty: number, unitPrice: number): string {
  const total = (qty * unitPrice).toFixed(2);
  return `${total} KES`;
}

export function formatBagLabel(qty: number, size: BagSize, type: BagType): string {
  const sizeLabel = size === 'small' ? 'Small' : size === 'medium' ? 'Medium' : 'Big';
  const typeLabel = type === 'plastic' ? 'Plastic' : 'Woven';
  return `${qty} × ${sizeLabel} ${typeLabel} Bag`;
}

export function formatPackLabel(qty: number, packSize: string): string {
  return `${qty} × ${packSize} Pack`;
}