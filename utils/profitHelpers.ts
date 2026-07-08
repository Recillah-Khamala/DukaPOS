/**
 * Utility helpers for profit calculations.
 */

import type { BasketItem } from '../types';
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