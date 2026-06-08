import { useState, useMemo } from 'react';
import type { BasketItem } from '../types';

const FRACTION_VALUES = [0.125, 0.25, 0.5, 1] as const;

const FRACTION_MAP: Record<number, '1/8' | '1/4' | '1/2' | '1'> = {
  0.125: '1/8',
  0.25: '1/4',
  0.5: '1/2',
  1: '1',
};

function snapToFraction(qty: number): number {
  if (FRACTION_VALUES.includes(qty as typeof FRACTION_VALUES[number])) return qty;
  // Snap to nearest standard fraction (round to nearest)
  const idx = FRACTION_VALUES.findIndex((v, i) => v >= qty || i === FRACTION_VALUES.length - 1);
  if (idx === -1) return FRACTION_VALUES[0];
  // Check if we're closer to the next value down
  if (idx > 0 && qty - FRACTION_VALUES[idx - 1] < FRACTION_VALUES[idx] - qty) {
    return FRACTION_VALUES[idx - 1];
  }
  return FRACTION_VALUES[idx] ?? FRACTION_VALUES[0];
}

export function useBasket(initialItems: BasketItem[] = []) {
  const [items, setItems] = useState<BasketItem[]>(initialItems);

  const addItem = (item: BasketItem) => {
    setItems((prev) => {
      const matchingKey = (i: BasketItem) =>
        i.type === 'bag'
          ? i.productId === item.productId && i.variantLabel === item.variantLabel
          : i.id === item.id || (i.productId === item.productId && i.type === item.type && i.fractionLabel === item.fractionLabel);
      const sameItem = prev.find(matchingKey);
      if (sameItem) {
        return prev.map((i) =>
          matchingKey(i) ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const isFractional = item.unitType === 'korokoro' || item.unitType === 'kg';
        const finalQty = isFractional ? snapToFraction(qty) : qty;
        const fractionLabel = item.fractionLabel ?? (isFractional && FRACTION_MAP[finalQty] ? FRACTION_MAP[finalQty] : undefined);
        return { ...item, qty: finalQty, fractionLabel };
      })
    );
  };

  const updateItemQty = (productId: string, newQty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const total = useMemo(() => {
    const sum = items.reduce((sum, item) => {
      if (item.fractionLabel) {
        return sum + item.unitPrice;
      }
      return sum + item.unitPrice * item.qty;
    }, 0);
    return Math.round(sum / 5) * 5;
  }, [items]);

  return { items, addItem, removeItem, updateQuantity, updateItemQty, clearBasket, total, clear: clearBasket };
}
