import { createContext, useContext, useState, type ReactNode } from 'react';
import { INVENTORY_ITEMS, type InventoryItem } from '../constants/inventoryData';
import { useDynamicProducts } from './DynamicProductsContext';

interface InventoryContextValue {
  allItems: InventoryItem[];
  getItemById: (id: string) => InventoryItem | undefined;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [seedOverrides, setSeedOverrides] = useState<Record<string, Partial<InventoryItem>>>({});
  const { dynamicProducts, updateDynamicProduct } = useDynamicProducts();

  // Combine seed items with overrides
  const seedItemsWithOverrides = INVENTORY_ITEMS.map(item => ({
    ...item,
    ...seedOverrides[item.id],
  }));

  const allItems = [...seedItemsWithOverrides, ...dynamicProducts];

  const getItemById = (id: string) => {
    // Check seed overrides first
    if (seedOverrides[id]) {
      const baseItem = INVENTORY_ITEMS.find(i => i.id === id);
      if (baseItem) {
        return { ...baseItem, ...seedOverrides[id] };
      }
    }
    // Check seed items without overrides
    const seedItem = INVENTORY_ITEMS.find(i => i.id === id);
    if (seedItem) return seedItem;
    // Check dynamic items
    return dynamicProducts.find(i => i.id === id);
  };

    const updateItem = (id: string, updates: Partial<InventoryItem>) => {
      const seedItemExists = INVENTORY_ITEMS.some(i => i.id === id);
      if (seedItemExists) {
        setSeedOverrides((prev: Record<string, Partial<InventoryItem>>) => ({
          ...prev,
          [id]: { ...(prev[id] || {}), ...updates },
        }));
      } else {
        // Assume it's a dynamic item
        const dynamicItem = dynamicProducts.find(item => item.id === id);
        if (dynamicItem) {
          updateDynamicProduct({ ...dynamicItem, ...updates });
        }
      }
    };

  return (
    <InventoryContext.Provider
      value={{
        allItems,
        getItemById,
        updateItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return ctx;
}
