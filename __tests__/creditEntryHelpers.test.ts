// __tests__/creditEntryHelpers.test.ts
import { buildCreditItems } from '../utils/creditEntryHelpers';
import { computeInventoryDeductionsForSale, buildExcessPaymentMessages } from '../app/new-credit-entry';

describe('buildCreditItems', () => {
  // Mock data for testing
  const mockAllItems: Array<{id: string; category: string}> = [
    { id: 'item1', category: 'category1' },
    { id: 'item2', category: 'category2' },
  ];

  it('should handle normal case (non-existing debt)', () => {
    const items = [
      { key: '1', name: 'Product 1', qty: '2', unitPrice: '10', category: 'category1', productId: 'item1' },
    ];
    const debtInfo = null;
    const result = buildCreditItems(false, items, debtInfo, mockAllItems);
    expect(result.length).toBe(1);
    expect(result[0].productId).toBe('item1');
    expect(result[0].category).toBe('category1'); // mapped from inventory category
    expect(result[0].qty).toBe('2');
    expect(result[0].unitPrice).toBe('10');
  });

  it('should handle legacy debt (existing debt)', () => {
    const items = [
      { key: '1', name: 'Product 1', qty: '2', unitPrice: '10', category: 'category1', productId: 'item1' },
    ];
    const debtInfo = { description: 'Old debt', category: 'category1' as const, total: 20 };
    const result = buildCreditItems(true, items, debtInfo, mockAllItems);
    expect(result.length).toBe(1);
    expect(result[0].productId).toBe('item1');
    expect(result[0].category).toBe('category1'); // should use the debtInfo category
    expect(result[0].qty).toBe('2');
    expect(result[0].unitPrice).toBe('10');
  });

  it('should handle deleted productId (productId undefined)', () => {
    const items = [
      { key: '1', name: 'Product 1', qty: '2', unitPrice: '10', category: 'category1', productId: undefined },
    ];
    const debtInfo = null;
    const result = buildCreditItems(false, items, debtInfo, mockAllItems);
    expect(result.length).toBe(1);
    expect(result[0].productId).toBeUndefined();
    expect(result[0].category).toBe('other'); // fallback category
  });
});

describe('computeInventoryDeductionsForSale', () => {
  const mockAllItems: Array<{id: string; currentStock: number; lowStockThreshold: number}> = [
    { id: 'item1', currentStock: 100, lowStockThreshold: 10 },
    { id: 'item2', currentStock: 5, lowStockThreshold: 3 },
  ];

  it('should handle normal deduction (stock sufficient)', () => {
    const builtItems = [
      { productId: 'item1', name: 'Item 1', qty: '5', unitPrice: '10', category: 'category1' as const },
    ];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);
    expect(warnings.length).toBe(0);
    expect(inventoryUpdates.length).toBe(1);
    expect(inventoryUpdates[0].currentStock).toBe(95); // 100 - 5
    expect(inventoryUpdates[0].isLowStock).toBe(false); // 95 > 10
  });

  it('should handle deduction that exceeds stock (clamp to zero)', () => {
    const builtItems = [
      { productId: 'item1', name: 'Item 1', qty: '150', unitPrice: '10', category: 'category1' as const },
    ];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain('Item 1 stock is now 0');
    expect(inventoryUpdates.length).toBe(1);
    expect(inventoryUpdates[0].currentStock).toBe(0);
    expect(inventoryUpdates[0].isLowStock).toBe(true); // 0 <= 10
  });

  it('should trigger low stock warning when stock drops to threshold', () => {
    const builtItems = [
      { productId: 'item2', name: 'Item 2', qty: '2', unitPrice: '10', category: 'category1' as const }, // 5 - 2 = 3, which equals threshold
    ];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain('Low stock: Item 2 (3 left)');
    expect(inventoryUpdates.length).toBe(1);
    expect(inventoryUpdates[0].currentStock).toBe(3);
    expect(inventoryUpdates[0].isLowStock).toBe(true); // 3 <= 3
  });

  it('should handle missing productId gracefully', () => {
    const builtItems = [
      { productId: undefined, name: 'Item 1', qty: '5', unitPrice: '10', category: 'category1' as const },
    ];
    const { warnings, inventoryUpdates } = computeInventoryDeductionsForSale(builtItems, mockAllItems);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain('skipped - inventory item not found');
    expect(inventoryUpdates.length).toBe(0);
  });
});

describe('buildExcessPaymentMessages', () => {
  it('should return correct message when excessPayment is 0', () => {
    const messages = buildExcessPaymentMessages(0, 100);
    expect(messages.length).toBe(1);
    expect(messages[0]).toContain('0');
    expect(messages[0]).toContain('100');
  });

  it('should return one message when excessPayment is within prior debt', () => {
    const messages = buildExcessPaymentMessages(30, 100);
    expect(messages.length).toBe(1);
    expect(messages[0]).toContain('30'); // appliedToDebt
    expect(messages[0]).toContain('70'); // stillOwing (100-30)
  });

  it('should return two messages when excessPayment exceeds prior debt', () => {
    const messages = buildExcessPaymentMessages(150, 100);
    expect(messages.length).toBe(2);
    // First message: appliedToDebt = 100, stillOwing = 0
    expect(messages[0]).toContain('100');
    expect(messages[0]).toContain('0');
    // Second message: changeDue = 50
    expect(messages[1]).toContain('50');
    expect(messages[1]).toContain('please give change');
  });
});