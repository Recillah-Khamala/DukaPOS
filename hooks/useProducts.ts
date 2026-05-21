import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { mockProducts } from '../constants/mockProducts';
import type { Product } from '../types';

const PRODUCTS_KEY = 'duka_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const saved = await loadData<Product[]>(PRODUCTS_KEY);
      if (saved) {
        setProducts(saved);
      } else {
        setProducts(mockProducts);
        await saveData(PRODUCTS_KEY, mockProducts);
      }
    };
    loadProducts();
  }, []);

  const addProduct = async (product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      saveData(PRODUCTS_KEY, updated).catch(console.error);
      return updated;
    });
  };

  return { products, addProduct };
}
