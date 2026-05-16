import type { Sale } from '../types';

export function getTotalRevenue(sales: Sale[]): number {
  return sales.reduce((sum, sale) => sum + sale.total, 0);
}

export function getTotalTransactions(sales: Sale[]): number {
  return sales.length;
}

export function getSalesByDate(sales: Sale[], date: Date): Sale[] {
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.getFullYear() === targetDate.getFullYear() &&
           saleDate.getMonth() === targetDate.getMonth() &&
           saleDate.getDate() === targetDate.getDate();
  });
}

export function getRevenueByDay(sales: Sale[]): { date: string, revenue: number }[] {
  const dailyRevenue = new Map<string, number>();
  
  sales.forEach(sale => {
    const date = new Date(sale.createdAt);
    const dateStr = date.toISOString().split('T')[0];
    dailyRevenue.set(dateStr, (dailyRevenue.get(dateStr) || 0) + sale.total);
  });
  
  return Array.from(dailyRevenue.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTopProducts(sales: Sale[], limit: number): { name: string, unitsSold: number, revenue: number }[] {
  const productStats = new Map<string, { unitsSold: number, revenue: number }>();
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const existing = productStats.get(item.name) || { unitsSold: 0, revenue: 0 };
      productStats.set(item.name, {
        unitsSold: existing.unitsSold + item.quantity,
        revenue: existing.revenue + (item.unitPrice * item.quantity)
      });
    });
  });
  
  return Array.from(productStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getPaymentMethodBreakdown(sales: Sale[]): { cash: number, mpesa: number } {
  const breakdown = { cash: 0, mpesa: 0 };
  
  sales.forEach(sale => {
    if (sale.paymentMethod === 'cash') {
      breakdown.cash++;
    } else if (sale.paymentMethod === 'mpesa') {
      breakdown.mpesa++;
    }
  });
  
  return breakdown;
}