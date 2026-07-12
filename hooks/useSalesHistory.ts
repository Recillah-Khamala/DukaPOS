import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import type { CompletedSale } from '../types';

const SALES_HISTORY_KEY = 'duka_sales_history';

export const useSalesHistory = () => {
  const [sales, setSales] = useState<CompletedSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      const saved = await loadData<CompletedSale[]>(SALES_HISTORY_KEY);
      // FIX: previously checked `Array.isArray(sales)` — `sales` is always the
      // local (empty) state at this point, so the check was a no-op that
      // always passed. Now checks the actual loaded value.
      if (saved && Array.isArray(saved)) {
        setSales(saved);
      }
      setLoading(false);
    };
    loadSales();
  }, []);

  const addSale = async (sale: CompletedSale) => {
    setSales(prev => {
      const newSales = [...prev, sale];
      saveData(SALES_HISTORY_KEY, newSales);
      return newSales;
    });
  };

  return { sales, addSale, loading };
};