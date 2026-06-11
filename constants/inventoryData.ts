import { type CerealProduct } from './salesData';

export type InventoryItem = {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  isLowStock: boolean;
};

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'c1',
    name: 'Maize',
    currentStock: 10,
    unit: 'Korokoro',
    lowStockThreshold: 15,
    isLowStock: true,
  },
  {
    id: 'c2',
    name: 'Beans',
    currentStock: 30,
    unit: 'Korokoro',
    lowStockThreshold: 25,
    isLowStock: false,
  },
  {
    id: 'c3',
    name: 'Groundnuts',
    currentStock: 5,
    unit: 'Korokoro',
    lowStockThreshold: 10,
    isLowStock: true,
  },
  {
    id: 'c4',
    name: 'Sorghum',
    currentStock: 50,
    unit: 'Korokoro',
    lowStockThreshold: 40,
    isLowStock: false,
  },
  {
    id: 'c5',
    name: 'Millet',
    currentStock: 20,
    unit: 'Korokoro',
    lowStockThreshold: 25,
    isLowStock: false,
  },
];