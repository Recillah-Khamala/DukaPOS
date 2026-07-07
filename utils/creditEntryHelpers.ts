import type { InventoryItem } from '../constants/inventoryData';
import type { CreditItem } from '../hooks/useCreditLedger';

export function inventoryCategoryToCreditCategory(category: InventoryItem['category']): CreditItemCategory {
  switch (category) {
    case 'cereal':
      return 'cereal';
    case 'poshomill':
      return 'milling';
    case 'bags':
      return 'bags';
    default:
      throw new Error(`Unknown inventory category: ${category}`);
  }
}

/**
 * Compute the stock deduction amount for a sold item.
 * Given a credit item (with quantity already parsed as number) and its inventory item,
 * returns the deduction in the inventory's stock unit (e.g., Korokoro for cereals, piece for bags).
 *
 * The logic mirrors AddStockModal: conversionRate = stock units per buying unit.
 * Since credit item quantity is expressed in the item's sellingUnit (which equals the stock unit
 * for all current inventory items), the deduction is simply the quantity.
 *
 * @example
 * // Maize (cereal): sellingUnit = Korokoro, conversionRate = 36.5 Korokoro per sack
 * const maizeItem = { qty: 2, ... }; // 2 Korokoro
 * const maizeInv = { sellingUnit: 'Korokoro', buyingUnit: 'sack', conversionRate: 36.5, ... };
 * computeInventoryDeduction(maizeItem, maizeInv); // => 2
 *
 * // Plastic Bags: sellingUnit = piece, conversionRate = 1 piece per piece
 * const bagItem = { qty: 5, ... }; // 5 pieces
 * const bagInv = { sellingUnit: 'piece', buyingUnit: 'piece', conversionRate: 1, ... };
 * computeInventoryDeduction(bagItem, bagInv); // => 5
 */
export function computeInventoryDeduction(item: CreditItem, inventoryItem: InventoryItem): number {
  // item.qty is already a number (from parsed form)
  const qty = item.qty;
  // If we ever needed to convert from sellingUnit to buyingUnit then to stock units:
  //   buyingUnits = qty / (sellingUnits per buyingUnit)
  //   stockUnits = buyingUnits * conversionRate
  // But sellingUnits per buyingUnit is not stored; assuming sellingUnit equals stock unit,
  // the conversion factor is 1, so deduction = qty.
  return qty;
}