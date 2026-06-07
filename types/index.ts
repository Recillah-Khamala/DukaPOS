import type { BagType, BagSize } from '../constants/bagData';

export interface BasketItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  type: 'cereal' | 'service';
  icon?: string;
  isService?: boolean;
  bagType?: BagType;
  bagSize?: BagSize;
  packagingMode?: 'kg' | 'bag' | 'pack';
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
