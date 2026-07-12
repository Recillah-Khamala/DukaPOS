// context/DynamicProductsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const DynamicProductsContext = createContext();
const DYNAMIC_PRODUCTS_KEY = 'duka_dynamic_products';

export const useDynamicProducts = () => useContext(DynamicProductsContext);
export const DynamicProductsProvider = ({ children }) => {
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicProducts = async () => {
      const saved = await loadData(DYNAMIC_PRODUCTS_KEY);
      setDynamicProducts(Array.isArray(saved) ? saved : []);
      setLoading(false);
    };
    loadDynamicProducts();
  }, []);

  const addDynamicProduct = async (product) => {
    setDynamicProducts(prev => {
      const newProducts = [...prev, product];
      saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
      return newProducts;
    });
  };

  const updateDynamicProduct = async (id, updates) => {
    setDynamicProducts(prev => {
      const newProducts = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      saveData(DYNAMIC_PRODUCTS_KEY, newProducts);
      return newProducts;
    });
  };

  return (
    <DynamicProductsContext.Provider value={{ dynamicProducts, addDynamicProduct, updateDynamicProduct, loading }}>
      {children}
    </DynamicProductsContext.Provider>
  );
};