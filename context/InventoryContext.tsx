import { createContext, useContext, useState, type ReactNode } from 'react';
import { INVENTORY_ITEMS, type InventoryItem } from '../constants/inventoryData';
import { useDynamicProducts } from './DynamicProductsContext';

interface InventoryContextValue {
  allItems: InventoryItem[];
  getItemById: (id: string) => InventoryItem | undefined;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  addItem: (item: InventoryItem) => void;
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [seedOverrides, setSeedOverrides] = useState<Record<string, Partial<InventoryItem>>>({});
  const { dynamicProducts, updateDynamicProduct, addDynamicProduct, loading } = useDynamicProducts();

  // Combine seed items with overrides
  const seedItemsWithOverrides: InventoryItem[] = INVENTORY_ITEMS.map(item => ({
    ...item,
    ...seedOverrides[item.id],
  }));

  const allItems: InventoryItem[] = [...seedItemsWithOverrides, ...dynamicProducts];

  const getItemById = (id: string): InventoryItem | undefined => {
    if (seedOverrides[id]) {
      const baseItem = INVENTORY_ITEMS.find(i => i.id === id);
      if (baseItem) {
        return { ...baseItem, ...seedOverrides[id] };
      }
    }
    const seedItem = INVENTORY_ITEMS.find(i => i.id === id);
    if (seedItem) return seedItem;
    return dynamicProducts.find((i: InventoryItem) => i.id === id);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    const seedItemExists = INVENTORY_ITEMS.some(i => i.id === id);
    if (seedItemExists) {
      setSeedOverrides((prev: Record<string, Partial<InventoryItem>>) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), ...updates },
      }));
    } else {
      const dynamicItem = dynamicProducts.find((item: InventoryItem) => item.id === id);
      if (dynamicItem) {
        updateDynamicProduct(id, updates);
      }
    }
  };

  const addItem = (item: InventoryItem) => {
    addDynamicProduct(item);
  };

  return (
    <InventoryContext.Provider
      value={{
        allItems,
        getItemById,
        updateItem,
        addItem,
        loading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return ctx;
}