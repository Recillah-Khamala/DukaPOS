import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { InventoryItem } from '../constants/inventoryData';
import { loadData, saveData } from '../utils/storage';

const DYNAMIC_PRODUCTS_KEY = 'duka_dynamic_products';

interface DynamicProductsContextValue {
  dynamicProducts: InventoryItem[];
  addDynamicProduct: (item: InventoryItem) => void;
  updateDynamicProduct: (item: InventoryItem) => void;
  loading: boolean;
}

const DynamicProductsContext = createContext<DynamicProductsContextValue | undefined>(undefined);

export function DynamicProductsProvider({ children }: { children: ReactNode }) {
  const [dynamicProducts, setDynamicProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      const saved = await loadData<InventoryItem[]>(DYNAMIC_PRODUCTS_KEY);
      if (saved && Array.isArray(saved)) {
        setDynamicProducts(saved);
      }
      setLoading(false);
    };
    load();
  }, []);

  const addDynamicProduct = (item: InventoryItem) => {
    setDynamicProducts((prev) => {
      const newProducts = [...prev, item];
      saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
      return newProducts;
    });
  };

  const updateDynamicProduct = (item: InventoryItem) => {
    setDynamicProducts((prev) => {
      const newProducts = prev.map((p) => (p.id === item.id ? item : p));
      saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
      return newProducts;
    });
  };

  return (
    <DynamicProductsContext.Provider
      value={{
        dynamicProducts,
        addDynamicProduct,
        updateDynamicProduct,
        loading,
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