export interface BasketItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  icon: string;
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
