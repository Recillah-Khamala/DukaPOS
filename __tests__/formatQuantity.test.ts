import { formatQty, formatLineTotal } from '../utils/formatQuantity';

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
