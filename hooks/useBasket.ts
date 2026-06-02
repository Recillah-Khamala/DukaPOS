import { useState, useMemo } from 'react';
import type { BasketItem } from '../types';

export function useBasket(initialItems: BasketItem[] = []) {
  const [items, setItems] = useState<BasketItem[]>(initialItems);

  const addItem = (item: BasketItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  return { items, addItem, removeItem, updateQuantity, clearBasket, total, clear: clearBasket };
}
