export type UnitType = 'korokoro' | 'kg' | 'cup' | 'piece' | 'bag_size' | 'custom';

export type FractionLabel = '1/8' | '1/4' | '1/2' | '1';

export type FractionValue = 0.125 | 0.25 | 0.5 | 1;

export interface FractionPrice {
  fraction: FractionValue;
  label: FractionLabel;
  price: number;
}

export interface ProductUnit {
  type: UnitType;
  label: string;
  fractionPrices?: FractionPrice[];
  pricePerUnit?: number;
}

export interface BagVariant {
  size: string;
  label: string;
  price: number;
}

export interface BagProduct {
  id: string;
  name: string;
  icon: string;
  variants: BagVariant[];
  unitType: 'bag_size';
}

export interface BasketItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  type: 'cereal' | 'service' | 'bag';
  icon?: string;
  isService?: boolean;
  unitType?: UnitType;
  fractionLabel?: string;
  unitLabel?: string;
  variantLabel?: string;
}

export type PaymentMethod = 'cash' | 'mpesa' | 'credit';

export interface CompletedSale {
  id: string;
  items: BasketItem[];
  total: number;
  paymentMethod: PaymentMethod;
  completedAt: string;
}

export interface Sale {
  id: string;
  items: BasketItem[];
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  completedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  barcode?: string;
  stock?: number;
  stockLevel?: number;
}

export type InventoryItem = {
    id: string;
    name: string;
    currentStock: number;
    buyingUnit: string;
    sellingUnit: string;
    conversionRate: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    category: 'cereal' | 'poshomill' | 'bags';
    fractionPrices: { label: string; fraction: number; price: number }[];
    description?: string;
    icon?: string;
    buyingPrice?: number;
};