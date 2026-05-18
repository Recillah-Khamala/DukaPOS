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
      } else if (process.env.NODE_ENV === 'development') {
        // Seed deterministic mock sales for visual testing in development
        const today = new Date();
        const mockSales: Sale[] = [
          {
            id: 's-001',
            items: [
              { id: 'p1', name: 'Tea Leaves - Premium', unitPrice: 70, quantity: 42, icon: 'local-cafe' },
            ],
            total: 3010,
            paymentMethod: 'cash',
            createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() as any,
          },
          {
            id: 's-002',
            items: [
              { id: 'p2', name: 'Sugar (2kg)', unitPrice: 64.48, quantity: 35, icon: 'shopping-cart' },
            ],
            total: 2257,
            paymentMethod: 'mpesa',
            createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString() as any,
          },
          {
            id: 's-003',
            items: [
              { id: 'p3', name: 'Maize Flour', unitPrice: 64.2857, quantity: 28, icon: 'local-dining' },
            ],
            total: 1800,
            paymentMethod: 'cash',
            createdAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString() as any,
          },
        ];

        setSalesHistory(mockSales);
        await saveData(SALES_KEY, mockSales);
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