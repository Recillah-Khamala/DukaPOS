import {
  buildCreditItems,
  buildCreditEntry,
  computeInventoryDeductionsForSale,
  buildExcessPaymentMessages,
  buildSaleFromEntry,
  computeInventoryDeduction,
  makeCustomerId,
  categoryToBasketType,
  inventoryCategoryToCreditCategory,
  DraftItem,
} from '../utils/creditEntryHelpers';
import type { CreditItemCategory } from '../hooks/useCreditLedger';
import type { InventoryItem } from '../constants/inventoryData';

// --- Shared mock inventory ---------------------------------------------

const mockMaize: InventoryItem = {
  id: 'item1',
  name: 'Maize',
  currentStock: 100,
  buyingUnit: 'sack',
  sellingUnit: 'Korokoro',
  conversionRate: 36.5,
  lowStockThreshold: 10,
  isLowStock: false,
  category: 'cereal',
  fractionPrices: [],
};

const mockBags: InventoryItem = {
  id: 'item2',
  name: 'Woven Bags',
  currentStock: 5,
  buyingUnit: 'piece',
  sellingUnit: 'piece',
  conversionRate: 1,
  lowStockThreshold: 3,
  isLowStock: false,
  category: 'bags',
  fractionPrices: [],
};

const mockAllItems: InventoryItem[] = [mockMaize, mockBags];

const makeDraftItem = (overrides: Partial<DraftItem> = {}): DraftItem => ({
  key: '1',
  name: 'Maize',
  qty: '2',
  unitPrice: '10',
  category: 'cereal' as CreditItemCategory,
  productId: 'item1',
  unit: undefined,
  ...overrides,
});

// --- buildCreditItems ----------------------------------------------------

describe('buildCreditItems', () => {
  it('maps a linked item, keeping the category the shopkeeper selected', () => {
    const items = [makeDraftItem()];
    const result = buildCreditItems(false, items, { description: '', category: 'other', total: 0 }, mockAllItems);

    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe('item1');
    expect(result[0].category).toBe('cereal');
    expect(result[0].qty).toBe(2);
    expect(result[0].unitPrice).toBe(10);
    expect(result[0].total).toBe(20);
    expect(result[0].balance).toBe(20);
    expect(result[0].amountPaid).toBe(0);
  });

  it('does not reset category to "other" for an unlinked (free-text) item', () => {
    const items = [makeDraftItem({ productId: undefined, category: 'bags' })];
    const result = buildCreditItems(false, items, { description: '', category: 'other', total: 0 }, mockAllItems);

    expect(result[0].productId).toBeUndefined();
    expect(result[0].category).toBe('bags');
  });

  it('clears a productId that no longer exists in inventory (deleted mid-flow)', () => {
    const items = [makeDraftItem({ productId: 'does-not-exist' })];
    const result = buildCreditItems(false, items, { description: '', category: 'other', total: 0 }, mockAllItems);

    expect(result[0].productId).toBeUndefined();
    // Category selection is still preserved even though the link was dropped
    expect(result[0].category).toBe('cereal');
  });

  it('legacy debt mode produces a single lump-sum item from the debt form, ignoring draft rows', () => {
    const items = [makeDraftItem({ qty: '999', unitPrice: '999' })];
    const debtInfo = { description: 'Old debt before app', category: 'other' as CreditItemCategory, total: 500 };
    const result = buildCreditItems(true, items, debtInfo, mockAllItems);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Old debt before app');
    expect(result[0].qty).toBe(1);
    expect(result[0].unitPrice).toBe(500);
    expect(result[0].total).toBe(500);
    expect(result[0].balance).toBe(500);
    expect(result[0].category).toBe('other');
    expect(result[0].productId).toBeUndefined();
  });

  it('legacy debt with a blank description falls back to a default label', () => {
    const debtInfo = { description: '   ', category: 'other' as CreditItemCategory, total: 100 };
    const result = buildCreditItems(true, [], debtInfo, mockAllItems);

    expect(result[0].name).toBe('Opening Balance (before app)');
  });
});

// --- buildCreditEntry ------------------------------------------------------

describe('buildCreditEntry', () => {
  it('marks the entry "paid" when deposit covers the full total', () => {
    const items = buildCreditItems(false, [makeDraftItem()], { description: '', category: 'other', total: 0 }, mockAllItems);
    const entry = buildCreditEntry('mama-njeri', 'Mama Njeri', items, 20, 20, '2026-01-01T00:00:00.000Z');

    expect(entry.balance).toBe(0);
    expect(entry.status).toBe('paid');
    expect(entry.amountPaid).toBe(20);
  });

  it('marks the entry "active" when there is a remaining balance', () => {
    const items = buildCreditItems(false, [makeDraftItem()], { description: '', category: 'other', total: 0 }, mockAllItems);
    const entry = buildCreditEntry('mama-njeri', 'Mama Njeri', items, 20, 5, '2026-01-01T00:00:00.000Z');

    expect(entry.balance).toBe(15);
    expect(entry.status).toBe('active');
  });

  it('trims the stored customer name', () => {
    const entry = buildCreditEntry('mama-njeri', '  Mama Njeri  ', [], 0, 0, '2026-01-01T00:00:00.000Z');
    expect(entry.customerName).toBe('Mama Njeri');
  });
});

// --- computeInventoryDeduction (unit conversion) ----------------------------

describe('computeInventoryDeduction', () => {
  it('uses qty directly when unit matches the selling unit (Korokoro)', () => {
    const item = { name: 'Maize', qty: 5, unitPrice: 10, total: 50, unit: 'Korokoro' };
    expect(computeInventoryDeduction(item, mockMaize)).toBe(5);
  });

  it('applies conversionRate when unit matches the buying unit (sack)', () => {
    const item = { name: 'Maize', qty: 2, unitPrice: 10, total: 20, unit: 'sack' };
    expect(computeInventoryDeduction(item, mockMaize)).toBe(2 * 36.5);
  });

  it('defaults to the selling unit when no unit is set', () => {
    const item = { name: 'Maize', qty: 3, unitPrice: 10, total: 30, unit: undefined };
    expect(computeInventoryDeduction(item, mockMaize)).toBe(3);
  });

  it('throws on an unrecognized unit rather than silently miscalculating', () => {
    const item = { name: 'Maize', qty: 3, unitPrice: 10, total: 30, unit: 'cup' };
    expect(() => computeInventoryDeduction(item, mockMaize)).toThrow();
  });
});

// --- computeInventoryDeductionsForSale --------------------------------------

describe('computeInventoryDeductionsForSale', () => {
  it('deducts normally when stock is sufficient, no warnings', () => {
    const builtItems = [{ name: 'Maize', qty: 5, unitPrice: 10, total: 50, productId: 'item1', unit: 'Korokoro' }];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);

    expect(warnings).toHaveLength(0);
    expect(inventoryUpdates).toHaveLength(1);
    expect(inventoryUpdates[0]).toEqual({ id: 'item1', currentStock: 95, isLowStock: false });
  });

  it('clamps to zero and still writes the update when deduction exceeds current stock', () => {
    const builtItems = [{ name: 'Maize', qty: 150, unitPrice: 10, total: 1500, productId: 'item1', unit: 'Korokoro' }];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Maize stock is now 0');
    expect(inventoryUpdates).toHaveLength(1);
    expect(inventoryUpdates[0]).toEqual({ id: 'item1', currentStock: 0, isLowStock: true });
  });

  it('warns when the new stock level is at or below the low-stock threshold', () => {
    const builtItems = [{ name: 'Woven Bags', qty: 3, unitPrice: 10, total: 30, productId: 'item2', unit: 'piece' }];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Low stock: Woven Bags (2 left)');
    expect(inventoryUpdates[0]).toEqual({ id: 'item2', currentStock: 2, isLowStock: true });
  });

  it('silently skips an ordinary unlinked (free-text) item — no warning, no update', () => {
    const builtItems = [{ name: 'Loose sugar', qty: 2, unitPrice: 10, total: 20, productId: undefined }];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);

    expect(warnings).toHaveLength(0);
    expect(inventoryUpdates).toHaveLength(0);
  });

  it('warns (but does not throw) when a productId no longer resolves to a real inventory item', () => {
    const builtItems = [{ name: 'Ghost Item', qty: 1, unitPrice: 10, total: 10, productId: 'does-not-exist' }];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Could not find inventory item');
    expect(inventoryUpdates).toHaveLength(0);
  });
});

// --- buildSaleFromEntry ------------------------------------------------------

describe('buildSaleFromEntry', () => {
  it('sets completedAt (not createdAt) so date-based reports can find it', () => {
    const builtItems = [{ name: 'Maize', qty: 2, unitPrice: 10, total: 20, category: 'cereal' as CreditItemCategory, productId: 'item1' }];
    const sale = buildSaleFromEntry({ id: 'entry-1' }, builtItems, 20, '2026-01-05T12:00:00.000Z');

    expect(sale.completedAt).toBe('2026-01-05T12:00:00.000Z');
    expect((sale as any).createdAt).toBeUndefined();
  });

  it('preserves the real inventory productId on linked items instead of a synthetic id', () => {
    const builtItems = [{ name: 'Maize', qty: 2, unitPrice: 10, total: 20, category: 'cereal' as CreditItemCategory, productId: 'item1' }];
    const sale = buildSaleFromEntry({ id: 'entry-1' }, builtItems, 20, '2026-01-05T12:00:00.000Z');

    expect(sale.items[0].productId).toBe('item1');
  });

  it('falls back to a synthetic productId for unlinked items', () => {
    const builtItems = [{ name: 'Loose sugar', qty: 1, unitPrice: 10, total: 10, category: 'other' as CreditItemCategory, productId: undefined }];
    const sale = buildSaleFromEntry({ id: 'entry-1' }, builtItems, 10, '2026-01-05T12:00:00.000Z');

    expect(sale.items[0].productId).toBe('entry-1-0');
  });

  it('maps category to basket type correctly for each category', () => {
    expect(categoryToBasketType('cereal')).toBe('cereal');
    expect(categoryToBasketType('bags')).toBe('bag');
    expect(categoryToBasketType('milling')).toBe('service');
    expect(categoryToBasketType('other')).toBe('service');
  });
});

// --- buildExcessPaymentMessages ----------------------------------------------

describe('buildExcessPaymentMessages', () => {
  it('reports full application when excess is fully absorbed by prior debt', () => {
    const messages = buildExcessPaymentMessages(30, 100);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('KES 30');
    expect(messages[0]).toContain('KES 70');
  });

  it('reports a second change-due message when excess exceeds all prior debt', () => {
    const messages = buildExcessPaymentMessages(150, 100);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain('KES 100');
    expect(messages[0]).toContain('KES 0');
    expect(messages[1]).toContain('KES 50');
    expect(messages[1]).toContain('please give change');
  });

  it('handles zero prior debt (excess payment with no existing debt) as pure change-due', () => {
    const messages = buildExcessPaymentMessages(40, 0);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain('KES 0');
    expect(messages[1]).toContain('KES 40');
  });
});

// --- makeCustomerId ------------------------------------------------------------

describe('makeCustomerId', () => {
  it('lowercases and hyphenates the name', () => {
    expect(makeCustomerId('Mama Njeri')).toBe('mama-njeri');
  });

  it('trims leading/trailing whitespace', () => {
    expect(makeCustomerId('  Mama Njeri  ')).toBe('mama-njeri');
  });

  it('collapses multiple internal spaces', () => {
    expect(makeCustomerId('Mama   Njeri')).toBe('mama-njeri');
  });

  it('strips punctuation so near-identical entries collide as intended', () => {
    expect(makeCustomerId('Mama Njeri!')).toBe('mama-njeri');
    expect(makeCustomerId('Mama, Njeri')).toBe('mama-njeri');
  });
});

// --- inventoryCategoryToCreditCategory ------------------------------------------

describe('inventoryCategoryToCreditCategory', () => {
  it('maps each known inventory category', () => {
    expect(inventoryCategoryToCreditCategory('cereal')).toBe('cereal');
    expect(inventoryCategoryToCreditCategory('poshomill')).toBe('milling');
    expect(inventoryCategoryToCreditCategory('bags')).toBe('bags');
  });

  it('throws on an unrecognized category rather than defaulting silently', () => {
    expect(() => inventoryCategoryToCreditCategory('unknown' as any)).toThrow();
  });
});