import type { InventoryItem } from '../constants/inventoryData';
import type { CreditItem, CreditItemCategory, CreditEntry } from '../hooks/useCreditLedger';

export type DraftItem = {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
  productId?: string;
  unit?: string;
};

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
  // If unit is not set (e.g., legacy draft or bags/poshomill path), default to sellingUnit
  // This is safe because the selling unit is the canonical unit in which stock is tracked.
  const unitToUse = item.unit ?? inventoryItem.sellingUnit;
  if (unitToUse === inventoryItem.sellingUnit) {
    return item.qty;
  }
  if (unitToUse === inventoryItem.buyingUnit) {
    return item.qty * inventoryItem.conversionRate;
  }
  throw new Error(`Invalid unit ${item.unit} for item ${item.name}. Expected ${inventoryItem.sellingUnit} or ${inventoryItem.buyingUnit}.`);
}

export function parseManualDate(day: string, month: string, year: string): string {
  // Assuming month is 1-indexed (1-12)
  const date = new Date(+year, +month - 1, +day);
  return date.toISOString();
}

export function makeCustomerId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

export function shouldApplyExcessPaymentToPriorDebt(isExistingDebt: boolean, excessPayment: number): boolean {
  return !isExistingDebt && excessPayment > 0;
}

export function buildCreditEntry(
  id: string,
  customerId: string,
  customerName: string,
  builtItems: CreditItem[],
  total: number,
  deposit: number,
  createdAt: string,
  lastUpdatedAt: string
): CreditEntry {
  const balance = Math.max(0, total - deposit);
  return {
    id,
    customerId,
    customerName: customerName.trim(),
    items: builtItems,
    totalAmount: total,
    amountPaid: deposit,
    balance,
    createdAt,
    lastUpdatedAt,
    status: balance <= 0.01 ? 'paid' : 'active',
  };
}

export function buildCreditItems(
  isExistingDebt: boolean,
  draftItems: DraftItem[],
  debtFields: { description: string; category: CreditItemCategory; total: number },
  allItems: InventoryItem[]
): CreditItem[] {
  if (isExistingDebt) {
    const { description, category, total } = debtFields;
    return [
      {
        name: description.trim() || 'Opening Balance (before app)',
        qty: 1,
        unitPrice: total,
        total: total,
        category,
        amountPaid: 0,
        balance: total,
        productId: undefined,
      },
    ];
  }

  return draftItems.map(item => {
    let productId = item.productId;
    // Guard against deleted inventory item
    if (productId && !allItems.some(it => it.id === productId)) {
      // Removed console.warn as per pure function requirement
      productId = undefined;
    }
    const qty = parseFloat(item.qty || '0') || 0;
    const unitPrice = parseFloat(item.unitPrice || '0') || 0;
    const total = qty * unitPrice;
    return {
      name: item.name.trim(),
      qty,
      unitPrice,
      total,
      category: item.category,
      amountPaid: 0,
      balance: total,
      productId,
      unit: item.unit,
    };
  });
}