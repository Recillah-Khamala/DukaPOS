import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadData, saveData } from '../utils/storage';
import type { InventoryItem } from '../constants/inventoryData';

const DYNAMIC_PRODUCTS_KEY = 'duka_dynamic_products';

interface DynamicProductsContextValue {
  dynamicProducts: InventoryItem[];
  addDynamicProduct: (product: InventoryItem) => Promise<void>;
  updateDynamicProduct: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  loading: boolean;
}

const DynamicProductsContext = createContext<DynamicProductsContextValue | undefined>(undefined);

export function DynamicProductsProvider({ children }: { children: ReactNode }) {
  const [dynamicProducts, setDynamicProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const saved = await loadData<InventoryItem[]>(DYNAMIC_PRODUCTS_KEY);
      setDynamicProducts(Array.isArray(saved) ? saved : []);
      setLoading(false);
    };
    load();
  }, []);

const addDynamicProduct = async (product: InventoryItem) => {
    const newProducts = [...dynamicProducts, product];
    await saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
    setDynamicProducts(newProducts);
  };

const updateDynamicProduct = async (id: string, updates: Partial<InventoryItem>) => {
    const newProducts = dynamicProducts.map(p => (p.id === id ? { ...p, ...updates } : p));
    await saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
    setDynamicProducts(newProducts);
  };

  return (
    <DynamicProductsContext.Provider value={{ dynamicProducts, addDynamicProduct, updateDynamicProduct, loading }}>
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