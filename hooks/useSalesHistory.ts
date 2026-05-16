import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import type { Sale } from '../types';

const SALES_KEY = 'duka_sales';

export function useSalesHistory() {
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      const savedSales = await loadData<Sale[]>(SALES_KEY);
      if (savedSales !== null) {
        setSalesHistory(savedSales);
      }
      setLoading(false);
    };
    loadSales();
  }, []);

  const addSale = async (sale: Sale) => {
    const updatedSales = [...salesHistory, sale];
    setSalesHistory(updatedSales);
    await saveData(SALES_KEY, updatedSales);
  };

  return { salesHistory, loading, addSale };
}