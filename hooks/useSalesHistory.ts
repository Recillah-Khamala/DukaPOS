import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { mockProducts } from '../constants/mockProducts';
import type { Sale, BasketItem } from '../types';

const SALES_KEY = 'duka_sales';

function productToBasketItem(product: typeof mockProducts[0]): BasketItem {
  const iconMap: Record<string, string> = {
    'Grains & Flour': 'grain',
    'Cooking': 'local-dining',
    'Beverages': 'local-cafe',
    'Household': 'cleaning-services',
  };
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    qty: Math.floor(Math.random() * 20) + 5,
    unitPrice: product.price,
    type: 'cereal',
    icon: iconMap[product.category] || 'shopping-bag',
  };
}

export function useSalesHistory() {
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      const savedSales = await loadData<Sale[]>(SALES_KEY);
      if (savedSales !== null) {
        // Convert createdAt strings back to Date objects
        const salesWithDates = savedSales.map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt)
        }));
        setSalesHistory(salesWithDates);
      } else {
        // Seed deterministic mock sales derived from mockProducts for visual testing
        const today = new Date();
        const mockSales: Sale[] = mockProducts.slice(0, 4).map((product, i) => {
          const items = [
            { ...productToBasketItem(product) },
          ];
          const qty = items[0].qty;
          return {
            id: `s-${String(i + 1).padStart(3, '0')}`,
            items,
            total: product.price * qty,
            paymentMethod: i % 2 === 0 ? 'cash' : 'mpesa',
            createdAt: new Date(today.getTime() - (i + 1) * 2 * 24 * 60 * 60 * 1000),
          };
        });

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