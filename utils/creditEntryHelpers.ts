import type { CreditItem, CreditItemCategory, CreditEntry } from '../hooks/useCreditLedger';
import { allocatePaymentToItems } from '../hooks/useCreditLedger';
import type { InventoryItem } from '../constants/inventoryData';
import type { BasketItem, CompletedSale } from '../types';

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
  // If unit is not set (e.g., legacy draft or bags/poshomill path), default to sellingUnit.
  // This is safe because the selling unit is the canonical unit in which stock is tracked.
  const unitToUse = item.unit ?? inventoryItem.sellingUnit;
  if (unitToUse === inventoryItem.sellingUnit) {
    return item.qty;
  }
  if (unitToUse === inventoryItem.buyingUnit) {
    return item.qty * inventoryItem.conversionRate;
  }
  throw new Error(
    `Invalid unit ${item.unit} for item ${item.name}. Expected ${inventoryItem.sellingUnit} or ${inventoryItem.buyingUnit}.`
  );
}

export function parseManualDate(day: string, month: string, year: string): string {
  // Assuming month is 1-indexed (1-12)
  const date = new Date(+year, +month - 1, +day);
  return date.toISOString();
}

/**
 * @deprecated Use UUIDs from CustomersContext instead. This function is kept for reference only.
 * Strips punctuation before collapsing whitespace, so "Mama Njeri!" and
 * "Mama, Njeri" both normalize to the same id. Does not solve genuine
 * misspellings or nicknames - that needs a customer picker, not a slug fix.
 */
export function makeCustomerId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

// Builds the line items for a credit sale. In legacy-debt mode, produces a
// single lump-sum "opening balance" item from the debt form fields — the
// per-product draft rows are not used in that mode. In normal mode, maps
// each draft row to a CreditItem, guarding against a productId that no
// longer exists in inventory (e.g. deleted between selection and save).
export function buildCreditItems(
  isExistingDebt: boolean,
  items: DraftItem[],
  debtInfo: { description: string; category: CreditItemCategory; total: number },
  allItems: InventoryItem[]
): CreditItem[] {
  if (isExistingDebt) {
    const total = Math.max(0, debtInfo.total || 0);
    return [
      {
        name: debtInfo.description.trim() || 'Opening Balance (before app)',
        qty: 1,
        unitPrice: total,
        total,
        category: debtInfo.category,
        amountPaid: 0,
        balance: total,
        productId: undefined,
      },
    ];
  }

  return items.map(item => {
    let productId = item.productId;
    if (productId && !allItems.some(it => it.id === productId)) {
      console.warn(`Product ID ${productId} not found in inventory. Removing product reference.`);
      productId = undefined;
    }
    const qty = parseFloat(item.qty) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const total = qty * unitPrice;
    return {
      name: item.name.trim(),
      qty,
      unitPrice,
      total,
      // Keep whatever category the shopkeeper selected (via CategoryPicker,
      // or auto-filled from the linked product) — do not silently reset it
      // to 'other' just because the item is unlinked from inventory.
      category: item.category,
      amountPaid: 0,
      balance: total,
      productId,
      unit: item.unit,
    };
  });
}

export function buildCreditEntry(
  customerId: string,
  customerName: string,
  builtItems: CreditItem[],
  total: number,
  deposit: number,
  createdAt: string
): CreditEntry {
  const balance = Math.max(0, total - deposit);
  return {
    id: Math.random().toString(36).substr(2, 9),
    customerId,
    customerName: customerName.trim(),
    items: builtItems,
    totalAmount: total,
    amountPaid: deposit,
    balance,
    createdAt,
    lastUpdatedAt: new Date().toISOString(),
    status: balance <= 0.01 ? 'paid' : 'active',
  };
}

// Builds the item list and grand total for a save, applying any upfront
// deposit's proportional allocation across items.
//
// FIX: the previous version computed `updatedItems` (the deposit-allocated
// version) and then discarded it, returning the raw unallocated `builtItems`
// instead. That meant every credit sale with a deposit saved item-level
// `balance` as the full item total, corrupting downstream FIFO repayment
// math. This version returns the allocated items.
export function prepareBuiltItemsAndTotal(
  isExistingDebt: boolean,
  items: DraftItem[],
  debtInfo: { description: string; category: CreditItemCategory; total: number } | null,
  allItems: InventoryItem[],
  deposit: number
): { builtItems: CreditItem[]; total: number } {
  const builtItems = buildCreditItems(
    isExistingDebt,
    items,
    debtInfo ?? { description: '', category: 'other' as CreditItemCategory, total: 0 },
    allItems
  );
  const total = builtItems.reduce((sum, item) => sum + item.total, 0);
  const updatedItems = deposit > 0 ? allocatePaymentToItems(builtItems, deposit) : builtItems;
  return { builtItems: updatedItems, total };
}

// Computes stock deductions for a credit sale's linked items.
//
// FIX: the previous version only pushed to `inventoryUpdates` inside the
// "stock sufficient" branch. When a sale oversold stock (deduction exceeds
// currentStock), it warned the shopkeeper that stock was now 0 but never
// actually wrote that back to inventory — the record stayed stale at its
// old value. `inventoryUpdates.push` now runs in both branches.
//
// Items with no productId (ordinary free-text, unlinked items) are skipped
// silently — this is expected, normal usage, not a warning-worthy case.
// Only a productId that no longer resolves to a real inventory item (e.g.
// deleted mid-flow) produces a warning.
export function computeInventoryDeductionsForSale(
  builtItems: CreditItem[],
  allItems: InventoryItem[]
): { warnings: string[]; inventoryUpdates: Array<{ id: string; currentStock: number; isLowStock: boolean }> } {
  const warnings: string[] = [];
  const inventoryUpdates: Array<{ id: string; currentStock: number; isLowStock: boolean }> = [];

  builtItems.forEach(item => {
    if (!item.productId) {
      return;
    }

    const inventoryItem = allItems.find(it => it.id === item.productId);
    if (!inventoryItem) {
      warnings.push(`Could not find inventory item for "${item.name}" — stock not updated.`);
      return;
    }

    const deduction = computeInventoryDeduction(item, inventoryItem);
    const currentStock = inventoryItem.currentStock;
    let newStock: number;
    let isLowStock: boolean;

    if (deduction > currentStock) {
      newStock = 0;
      isLowStock = true;
      warnings.push(`${inventoryItem.name} stock is now 0 — sale exceeded recorded stock`);
    } else {
      newStock = currentStock - deduction;
      isLowStock = newStock <= inventoryItem.lowStockThreshold;
      if (isLowStock) {
        warnings.push(`Low stock: ${inventoryItem.name} (${newStock} left)`);
      }
    }

    // Always record the update — including the oversold-to-zero case above.
    inventoryUpdates.push({ id: inventoryItem.id, currentStock: newStock, isLowStock });
  });

  return { warnings, inventoryUpdates };
}

// Builds the CompletedSale record fed into Reports/Business Health.
//
// FIX: the previous version set `createdAt` on the returned object, but
// CompletedSale's actual field is `completedAt` — every downstream
// date-based filter (today/yesterday buckets, 7-day trend, profit
// summaries) reads `sale.completedAt`. With the wrong field name, every
// credit sale's `completedAt` was `undefined`, silently breaking all
// date-based reporting for credit sales.
export function buildSaleFromEntry(
  entry: { id: string },
  builtItems: CreditItem[],
  total: number,
  createdAt: string
): CompletedSale {
  const saleItems: BasketItem[] = builtItems.map((item, idx) => ({
    id: `${entry.id}-${idx}`,
    productId: item.productId ?? `${entry.id}-${idx}`,
    name: item.name,
    qty: item.qty,
    unitPrice: item.unitPrice,
    type: categoryToBasketType(item.category as CreditItemCategory),
  }));
  return {
    id: entry.id,
    items: saleItems,
    total,
    paymentMethod: 'credit',
    completedAt: createdAt,
  };
}

export function buildExcessPaymentMessages(excessPayment: number, priorDebt: number): string[] {
  const messages: string[] = [];
  const appliedToDebt = Math.min(excessPayment, priorDebt);
  const stillOwing = Math.max(0, priorDebt - excessPayment);
  messages.push(
    `Sale paid in full. KES ${appliedToDebt.toLocaleString()} applied to previous debt. Remaining debt: KES ${stillOwing.toLocaleString()}.`
  );
  if (excessPayment > priorDebt) {
    const changeDue = excessPayment - priorDebt;
    messages.push(`Customer overpaid by KES ${changeDue.toLocaleString()} beyond all debts — please give change.`);
  }
  return messages;
}
