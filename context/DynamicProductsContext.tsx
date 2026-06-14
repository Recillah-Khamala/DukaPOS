import { createContext, useContext, useState, type ReactNode } from 'react';
import type { InventoryItem } from '../constants/inventoryData';

interface DynamicProductsContextValue {
  dynamicProducts: InventoryItem[];
  addDynamicProduct: (item: InventoryItem) => void;
  updateDynamicProduct: (item: InventoryItem) => void;
}

const DynamicProductsContext = createContext<DynamicProductsContextValue | undefined>(undefined);

export function DynamicProductsProvider({ children }: { children: ReactNode }) {
  const [dynamicProducts, setDynamicProducts] = useState<InventoryItem[]>([]);

  const addDynamicProduct = (item: InventoryItem) => {
    setDynamicProducts((prev) => [...prev, item]);
  };

  const updateDynamicProduct = (item: InventoryItem) => {
    setDynamicProducts((prev) => prev.map(p => p.id === item.id ? item : p));
  };

  return (
    <DynamicProductsContext.Provider
      value={{
        dynamicProducts,
        addDynamicProduct,
        updateDynamicProduct,
      }}
    >
      {children}
    </DynamicProductsContext.Provider>
  );
}

export function useDynamicProducts(): DynamicProductsContextValue {
  const ctx = useContext(DynamicProductsContext);
  if (!ctx) {
    throw new Error('useDynamicProducts must be used within a DynamicProductsProvider');
  }
  return ctx;
}