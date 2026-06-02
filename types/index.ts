export interface BasketItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  type: 'cereal' | 'service';
  icon?: string;
  isService?: boolean;
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
}
