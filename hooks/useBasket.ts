import { useState, useMemo } from 'react';
import type { BasketItem } from '../types';

export function useBasket(initialItems: BasketItem[] = []) {
  const [items, setItems] = useState<BasketItem[]>(initialItems);

  const addItem = (item: BasketItem) => {
    setItems((prev) => {
      const sameId = prev.find((i) => i.id === item.id);
      if (sameId) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
        );
      }
      const sameProduct = prev.find((i) => i.productId === item.productId && i.type === item.type);
      if (sameProduct) {
        return prev.map((i) =>
          i.productId === item.productId && i.type === item.type ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
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
      prev.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  }, [items]);

  return { items, addItem, removeItem, updateQuantity, clearBasket, total, clear: clearBasket };
}
