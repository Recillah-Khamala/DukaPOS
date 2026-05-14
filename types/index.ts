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
