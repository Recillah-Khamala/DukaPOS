import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { useBasket } from '../hooks/useBasket';
import type { BasketItem } from '../types';

interface BasketContextValue {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  total: number;
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const basket = useBasket();

  const value = useMemo(() => basket, [basket.items, basket.total]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

/** Shared basket hook — use this inside any component wrapped by BasketProvider. */
export function useSharedBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error('useSharedBasket must be used within a BasketProvider');
  }
  return ctx;
}

