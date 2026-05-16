import { useState, useEffect } from 'react';
import { loadData } from '../utils/storage';
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

  const addSale = (sale: Sale) => {
    setSales((prev) => [...prev, sale]);
  };

  return { sales, loading, addSale };
}