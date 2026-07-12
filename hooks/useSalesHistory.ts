// hooks/useSalesHistory.ts
import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const SALES_HISTORY_KEY = 'duka_sales_history';

export const useSalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      const saved = await loadData(SALES_HISTORY_KEY);
      if (saved && Array.isArray(sales)) {
        setSales(saved);
      }
      setLoading(false);
    };
    loadSales();
  }, []);

  const addSale = async (sale) => {
    setSales(prev => {
      const newSales = [...prev, sale];
      saveData(SALES_HISTORY_KEY, newSales);
      return newSales;
    });
  };

  // ... other functions if any

  return { sales, addSale, /* ... */, loading };
};