import { formatQty, formatLineTotal, formatBagLabel, formatPackLabel } from '../utils/formatQuantity';

describe('formatQty', () => {
  it('formats 1/8 as fraction', () => {
    expect(formatQty(0.125)).toBe('1/8');
  });

  it('formats 1/4 as fraction', () => {
    expect(formatQty(0.25)).toBe('1/4');
  });

  it('formats 1/2 as fraction', () => {
    expect(formatQty(0.5)).toBe('1/2');
  });

  it('formats whole numbers', () => {
    expect(formatQty(1)).toBe('1');
    expect(formatQty(2)).toBe('2');
    expect(formatQty(10)).toBe('10');
  });

  it('formats mid-values like 1.75', () => {
    expect(formatQty(1.75)).toBe('1.75');
  });

  it('formats other decimals removing trailing zeros', () => {
    expect(formatQty(1.5)).toBe('1.5');
    expect(formatQty(2.25)).toBe('2.25');
    expect(formatQty(0.333)).toBe('0.333');
  });
});

describe('formatLineTotal', () => {
  it('formats line total as KES', () => {
    expect(formatLineTotal(1, 50)).toBe('50.00 KES');
    expect(formatLineTotal(0.25, 100)).toBe('25.00 KES');
    expect(formatLineTotal(2.5, 40)).toBe('100.00 KES');
  });
});

describe('formatBagLabel', () => {
  it('formats qty 1 with small plastic bag', () => {
    expect(formatBagLabel(1, 'small', 'plastic')).toBe('1 × Small Plastic Bag');
  });

  it('formats qty 1 with medium woven bag', () => {
    expect(formatBagLabel(1, 'medium', 'woven')).toBe('1 × Medium Woven Bag');
  });

  it('formats qty 2 with big plastic bag', () => {
    expect(formatBagLabel(2, 'big', 'plastic')).toBe('2 × Big Plastic Bag');
  });

  it('formats large quantities correctly', () => {
    expect(formatBagLabel(99, 'medium', 'woven')).toBe('99 × Medium Woven Bag');
  });

  it('formats decimal quantities', () => {
    expect(formatBagLabel(1.5, 'big', 'plastic')).toBe('1.5 × Big Plastic Bag');
  });
});

describe('formatPackLabel', () => {
  it('formats qty 1 with pack size', () => {
    expect(formatPackLabel(1, '500g')).toBe('1 × 500g Pack');
  });

  it('formats qty 3 with pack size', () => {
    expect(formatPackLabel(3, '1kg')).toBe('3 × 1kg Pack');
  });

  it('formats large quantities correctly', () => {
    expect(formatPackLabel(99, '500g')).toBe('99 × 500g Pack');
  });

  it('formats decimal quantities', () => {
    expect(formatPackLabel(2.5, '250g')).toBe('2.5 × 250g Pack');
  });
});