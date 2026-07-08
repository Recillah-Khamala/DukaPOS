import type { InventoryItem } from '../constants/inventoryData';
import type { CreditItem, CreditItemCategory } from '../hooks/useCreditLedger';

export function inventoryCategoryToCreditCategory(category: InventoryItem['category']): CreditItemCategory {
  switch (category) {
    case 'cereal':
      return 'cereal';
    case 'poshomill':
      return 'milling';
    case 'bags':
      return 'bags';
    default:
      throw new Error(`Unknown inventory category: ${category}`);
  }
}

export function categoryToBasketType(category: CreditItemCategory): 'cereal' | 'bag' | 'service' {
  switch (category) {
    case 'cereal':
      return 'cereal';
    case 'bags':
      return 'bag';
    case 'milling':
    case 'other':
      return 'service';
  }
}

export function computeInventoryDeduction(item: CreditItem, inventoryItem: InventoryItem): number {
  if (item.unit === inventoryItem.sellingUnit) {
    return item.qty;
  }
  if (item.unit === inventoryItem.buyingUnit) {
    return item.qty * inventoryItem.conversionRate;
  }
  throw new Error(`Invalid unit ${item.unit} for item ${item.name}. Expected ${inventoryItem.sellingUnit} or ${inventoryItem.buyingUnit}.`);
}

export function parseManualDate(day: string, month: string, year: string): string {
  // Assuming month is 1-indexed (1-12)
  const date = new Date(+year, +month - 1, +day);
  return date.toISOString();
}