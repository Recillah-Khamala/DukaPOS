import type { InventoryItem } from '../constants/inventoryData';
import type { CreditItemCategory } from '../hooks/useCreditLedger';

export function inventoryCategoryToCreditCategory(category: InventoryItem['category']): CreditItemCategory {
  switch (category) {
    case 'cereal':
      return 'Cereal' as CreditItemCategory;
    case 'poshomill':
      return 'Milling' as CreditItemCategory;
    case 'bags':
      return 'Bags' as CreditItemCategory;
    default:
      throw new Error(`Unknown inventory category: ${category}`);
  }
}