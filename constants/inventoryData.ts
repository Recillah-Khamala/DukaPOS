import { type CerealProduct } from './salesData';

export type InventoryItem = {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  isLowStock: boolean;
  category: 'cereal' | 'poshomill';
  fractionPrices: { label: string; fraction: number; price: number }[];
};

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'c1',
    name: 'Maize',
    currentStock: 10,
    unit: 'Korokoro',
    lowStockThreshold: 15,
    isLowStock: true,
    category: 'cereal',
    fractionPrices: [
      { label: '1/8', fraction: 0.125, price: 20 },
      { label: '1/4', fraction: 0.25, price: 38 },
      { label: '1/2', fraction: 0.5, price: 70 },
      { label: '1', fraction: 1, price: 130 },
    ],
  },
  {
    id: 'c2',
    name: 'Beans',
    currentStock: 30,
    unit: 'Korokoro',
    lowStockThreshold: 25,
    isLowStock: false,
    category: 'cereal',
    fractionPrices: [
      { label: '1/8', fraction: 0.125, price: 20 },
      { label: '1/4', fraction: 0.25, price: 40 },
      { label: '1/2', fraction: 0.5, price: 80 },
      { label: '1', fraction: 1, price: 160 },
    ],
  },
  {
    id: 'c3',
    name: 'Groundnuts',
    currentStock: 5,
    unit: 'Korokoro',
    lowStockThreshold: 10,
    isLowStock: true,
    category: 'cereal',
    fractionPrices: [
      { label: '1/8', fraction: 0.125, price: 25 },
      { label: '1/4', fraction: 0.25, price: 50 },
      { label: '1/2', fraction: 0.5, price: 110 },
      { label: '1', fraction: 1, price: 220 },
    ],
  },
  {
    id: 'c4',
    name: 'Sorghum',
    currentStock: 50,
    unit: 'Korokoro',
    lowStockThreshold: 40,
    isLowStock: false,
    category: 'cereal',
    fractionPrices: [
      { label: '1/8', fraction: 0.125, price: 15 },
      { label: '1/4', fraction: 0.25, price: 30 },
      { label: '1/2', fraction: 0.5, price: 55 },
      { label: '1', fraction: 1, price: 110 },
    ],
  },
  {
    id: 'c5',
    name: 'Millet',
    currentStock: 20,
    unit: 'Korokoro',
    lowStockThreshold: 25,
    isLowStock: false,
    category: 'cereal',
    fractionPrices: [
      { label: '1/8', fraction: 0.125, price: 20 },
      { label: '1/4', fraction: 0.25, price: 40 },
      { label: '1/2', fraction: 0.5, price: 80 },
      { label: '1', fraction: 1, price: 145 },
    ],
  },
];