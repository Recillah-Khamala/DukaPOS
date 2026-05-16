import { useState } from 'react';
import type { Sale } from '../types';

export type DateRange = 'today' | 'this_week' | 'this_month' | 'all_time';

export function useDateFilter() {
  const [selectedRange, setSelectedRange] = useState<DateRange>('today');

  const setRange = (range: DateRange) => {
    setSelectedRange(range);
  };

  const filterSales = (sales: Sale[]): Sale[] => {
    if (selectedRange === 'all_time') {
      return sales;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const saleDay = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());

      switch (selectedRange) {
        case 'today':
          return saleDay.getTime() === today.getTime();
        case 'this_week':
          return saleDay >= startOfWeek && saleDay <= today;
        case 'this_month':
          return saleDay >= startOfMonth && saleDay <= today;
        default:
          return true;
      }
    });
  };

  return { selectedRange, setRange, filterSales };
}