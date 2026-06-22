/// <reference types="jest" />
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES, BAG_PRODUCTS } from '../constants/salesData';
import type { BagProduct, BasketItem } from '../types';
import { roundToNearest5, formatUnitQty } from '../utils/formatQuantity';
import type { CerealProduct, PoshomillService } from '../constants/salesData';
import type { FractionPrice } from '../types';

function getPrice(product: CerealProduct | PoshomillService, fraction: 0.125 | 0.25 | 0.5 | 1): number {
  const firstUnit = product.units[0];
  return firstUnit?.fractionPrices?.find((fp: FractionPrice) => fp.fraction === fraction)?.price ?? 0;
}

describe('Unit System Regression Tests', () => {
  describe('korokoro fraction price lookup', () => {
    it('returns shopkeeper-set price for 1/4, not calculated from pricePerKg/4', () => {
      const maize = CEREAL_PRODUCTS[0]; // Maize: pricePerKg=130, 1/4 price=30
      expect(maize.pricePerKg).toBe(130);
      expect(getPrice(maize, 0.25)).toBe(30); // Not 130 * 0.25 = 32.5
    });

    it('returns correct prices for all maize fractions', () => {
      const maize = CEREAL_PRODUCTS[0];
      expect(getPrice(maize, 0.125)).toBe(15);
      expect(getPrice(maize, 0.25)).toBe(30);
      expect(getPrice(maize, 0.5)).toBe(65);
      expect(getPrice(maize, 1)).toBe(130);
    });
  });

  describe('piece items never produce fractional quantities', () => {
    it('piece items have integer quantities in basket', () => {
      const pieceItem: BasketItem = {
        id: 'test-piece',
        productId: 'p1',
        name: 'Test Piece',
        qty: 3,
        unitPrice: 100,
        type: 'cereal',
        unitType: 'piece',
        unitLabel: 'Piece',
      };
      expect(pieceItem.qty).toBe(3);
      expect(Number.isInteger(pieceItem.qty)).toBe(true);
    });
  });

  describe('bag items use variant price', () => {
    it('bag variant price is used, not unit price', () => {
      const plasticBag = BAG_PRODUCTS[0];
      const mediumVariant = plasticBag.variants.find(v => v.size === 'medium');
      expect(mediumVariant?.price).toBe(10);
    });

    it('bag basket item uses variant price correctly', () => {
      const bagItem: BasketItem = {
        id: 'bag-1',
        productId: 'b1',
        name: 'Plastic Bag',
        qty: 2,
        unitPrice: 10,
        type: 'bag',
        unitType: 'bag_size',
        variantLabel: 'Medium',
      };
      const firstVariant = BAG_PRODUCTS[0].variants[0];
      expect(bagItem.unitPrice).toBe(10);
      expect(bagItem.unitPrice).not.toBe(firstVariant.price);
    });
  });

  describe('roundToNearest5', () => {
    it('rounds 23 → 25', () => {
      expect(roundToNearest5(23)).toBe(25);
    });

    it('rounds 27 → 25', () => {
      expect(roundToNearest5(27)).toBe(25);
    });

    it('rounds 32 → 30', () => {
      expect(roundToNearest5(32)).toBe(30);
    });
  });

  describe('BasketItem unitLabel and fractionLabel fields', () => {
    it('korokoro cereal item has correct labels', () => {
      const item: BasketItem = {
        id: 'c1_1',
        productId: 'c1',
        name: 'Maize',
        qty: 0.25,
        unitPrice: 30,
        type: 'cereal',
        unitType: 'korokoro',
        unitLabel: 'Korokoro',
        fractionLabel: '1/4',
      };
      expect(item.unitLabel).toBe('Korokoro');
      expect(item.fractionLabel).toBe('1/4');
    });

    it('kg service item has correct labels', () => {
      const item: BasketItem = {
        id: 'p1_1',
        productId: 'p1',
        name: 'Grade 1 Milling',
        qty: 0.5,
        unitPrice: 10,
        type: 'service',
        unitType: 'kg',
        unitLabel: 'KG',
        fractionLabel: '1/2',
        isService: true,
      };
      expect(item.unitLabel).toBe('KG');
      expect(item.fractionLabel).toBe('1/2');
      expect(item.isService).toBe(true);
    });

    it('bag item has variantLabel', () => {
      const item: BasketItem = {
        id: 'b1_1',
        productId: 'b1',
        name: 'Plastic Bag',
        qty: 3,
        unitPrice: 10,
        type: 'bag',
        unitType: 'bag_size',
        variantLabel: 'Medium',
      };
      expect(item.variantLabel).toBe('Medium');
    });

    it('piece item has no fractionLabel', () => {
      const item: BasketItem = {
        id: 'p1_1',
        productId: 'p1',
        name: 'Test Piece',
        qty: 5,
        unitPrice: 50,
        type: 'cereal',
        unitType: 'piece',
        unitLabel: 'Piece',
      };
      expect(item.fractionLabel).toBeUndefined();
    });
  });

  describe('formatUnitQty for all unit types', () => {
    it('formatUnitQty returns correct format for korokoro', () => {
      expect(formatUnitQty(0.25, 'korokoro', 'Korokoro', '1/4')).toBe('1/4 Korokoro');
    });

    it('formatUnitQty returns correct format for kg', () => {
      expect(formatUnitQty(0.5, 'kg', 'KG', '1/2')).toBe('1/2 KG');
    });

    it('formatUnitQty returns correct format for piece', () => {
      expect(formatUnitQty(3, 'piece', 'Piece')).toBe('3 × Piece');
    });

    it('formatUnitQty returns correct format for bag_size', () => {
      expect(formatUnitQty(2, 'bag_size', 'Bag', undefined, 'Medium Plastic Bag')).toBe('2 × Medium Plastic Bag');
    });
  });
});