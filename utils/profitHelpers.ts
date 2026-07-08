/**
 * Utility helpers for profit calculations.
 */

import type { BasketItem, CompletedSale } from '../types';
import type { InventoryItem } from '../constants/inventoryData';

export function getItemCost(basketItem: BasketItem, allItems: InventoryItem[]): { cost: number; costKnown: boolean } {
  if (!basketItem.productId) {
    return { cost: 0, costKnown: false };
  }
  const item = allItems.find(i => i.id === basketItem.productId);
  if (!item || item.buyingPrice === undefined) {
    return { cost: 0, costKnown: false };
  }
  const costPerSellingUnit = item.buyingPrice / item.conversionRate;
  const cost = costPerSellingUnit * basketItem.qty;
  return { cost, costKnown: true };
}

export function computeSaleProfit(sale: CompletedSale, allItems: InventoryItem[]): {
  revenue: number;
  actualCogs: number;
  projectedCogs: number;
  actualProfit: number;
  projectedProfit: number;
  itemsWithUnknownCost: string[];
} {
  const revenue = sale.total;
  let actualCogs = 0;
  let projectedCogs = 0;
  const itemsWithUnknownCost: string[] = [];

for (const item of sale.items) {
     const costResult = getItemCost(item, allItems);
     if (costResult.costKnown) {
       const cost = costResult.cost;
       actualCogs += cost;
       projectedCogs += cost;
     } else {
       // For unknown cost, we assume 0 cost for both actual and projected.
       // This is a temporary defensible default (zero cost) until a better fallback is decided.
       // We record the item name for UI to highlight unknown cost items.
       itemsWithUnknownCost.push(item.name);
     }
   }

  const actualProfit = revenue - actualCogs;
  const projectedProfit = revenue - projectedCogs; // same as actualProfit with current logic

  return {
    revenue,
    actualCogs,
    projectedCogs,
    actualProfit,
    projectedProfit,
    itemsWithUnknownCost,
  };
}