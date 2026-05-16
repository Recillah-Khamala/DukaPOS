import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import type { Sale } from '../types';

const SALES_KEY = 'duka_sales';

export function useSalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      const savedSales = await loadData<Sale[]>(SALES_KEY);
      if (savedSales !== null) {
        setSales(savedSales);
      }
      setLoading(false);
    };
    loadSales();
  }, []);

  const addSale = async (sale: Sale) => {
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
    await saveData(SALES_KEY, updatedSales);
  };

  return { sales, loading, addSale };
}