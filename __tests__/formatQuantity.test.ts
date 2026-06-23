/// <reference types="jest" />
import { formatQty, formatLineTotal, formatUnitQty, formatPriceRange, roundToNearest5 } from '../utils/formatQuantity';
import type { FractionPrice } from '../types';

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
  it('formats line total as rounded KES', () => {
    expect(formatLineTotal(1, 50)).toBe('50 KES');
    expect(formatLineTotal(0.25, 100)).toBe('25 KES');
    expect(formatLineTotal(2.5, 40)).toBe('100 KES');
  });

  it('rounds to nearest 5', () => {
    expect(formatLineTotal(1, 23)).toBe('25 KES');
    expect(formatLineTotal(1, 27)).toBe('25 KES');
    expect(formatLineTotal(1, 28)).toBe('30 KES');
  });
});

describe('roundToNearest5', () => {
  it('rounds to nearest 5', () => {
    expect(roundToNearest5(23)).toBe(25);
    expect(roundToNearest5(27)).toBe(25);
    expect(roundToNearest5(28)).toBe(30);
    expect(roundToNearest5(32)).toBe(30);
    expect(roundToNearest5(33)).toBe(35);
  });

  it('handles multiples of 5', () => {
    expect(roundToNearest5(25)).toBe(25);
    expect(roundToNearest5(30)).toBe(30);
    expect(roundToNearest5(100)).toBe(100);
  });
});

describe('formatUnitQty', () => {
  it('formats korokoro with fraction label', () => {
    expect(formatUnitQty(0.25, 'korokoro', 'Korokoro', '1/4')).toBe('1/4 Korokoro');
  });

  it('formats korokoro without fraction label', () => {
    expect(formatUnitQty(2, 'korokoro', 'Korokoro')).toBe('2 Korokoro');
  });

  it('formats kg with fraction label', () => {
    expect(formatUnitQty(0.5, 'kg', 'KG', '1/2')).toBe('1/2 KG');
  });

  it('formats piece items with multiplication', () => {
    expect(formatUnitQty(3, 'piece', 'Piece')).toBe('3 × Piece');
  });

  it('formats bag_size with variant label', () => {
    expect(formatUnitQty(2, 'bag_size', 'Bag', undefined, 'Medium Plastic Bag')).toBe('2 × Medium Plastic Bag');
  });

  it('formats cup items', () => {
    expect(formatUnitQty(1.5, 'cup', 'Cup')).toBe('1.5 Cup');
  });
});

describe('formatPriceRange', () => {
  it('returns min – max KES range', () => {
    const prices: FractionPrice[] = [
      { fraction: 0.125, label: '1/8', price: 15 },
      { fraction: 0.25, label: '1/4', price: 30 },
      { fraction: 0.5, label: '1/2', price: 65 },
      { fraction: 1, label: '1', price: 130 },
    ];
    expect(formatPriceRange(prices)).toBe('15 – 130 KES');
  });

  it('handles single price', () => {
    const prices: FractionPrice[] = [
      { fraction: 1, label: '1', price: 100 },
    ];
    expect(formatPriceRange(prices)).toBe('100 – 100 KES');
  });

  it('handles empty array', () => {
    expect(formatPriceRange([])).toBe('');
  });
});