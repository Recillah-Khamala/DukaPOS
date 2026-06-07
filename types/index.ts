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

export interface BasketItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  type: 'cereal' | 'service';
  icon?: string;
  isService?: boolean;
  unitType?: UnitType;
  fractionLabel?: FractionLabel;
  unitLabel?: string;
}

export type PaymentMethod = 'cash' | 'mpesa';

export interface Sale {
  id: string;
  items: BasketItem[];
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
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