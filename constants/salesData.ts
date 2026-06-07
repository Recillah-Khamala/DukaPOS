import type { ProductUnit, UnitType, FractionPrice, BagProduct } from '../types';

export type CerealProduct = {
  id: string
  name: string
  icon: string
  type: 'cereal'
  units: ProductUnit[]
  stockLevel?: number
  pricePerKg: number
}

export type PoshomillService = {
  id: string
  name: string
  icon: string
  units: ProductUnit[]
  pricePerKg: number
}

const createFractionPrices = (prices: { '1/8': number; '1/4': number; '1/2': number; '1': number }): FractionPrice[] => [
  { fraction: 0.125, label: '1/8', price: prices['1/8'] },
  { fraction: 0.25, label: '1/4', price: prices['1/4'] },
  { fraction: 0.5, label: '1/2', price: prices['1/2'] },
  { fraction: 1, label: '1', price: prices['1'] },
];

export const CEREAL_PRODUCTS: CerealProduct[] = [
  {
    id: 'c1',
    name: 'Maize',
    icon: 'grass',
    type: 'cereal',
    pricePerKg: 130,
    units: [
      {
        type: 'korokoro',
        label: 'Korokoro',
        fractionPrices: createFractionPrices({ '1/8': 15, '1/4': 30, '1/2': 65, '1': 130 }),
      },
    ],
  },
  {
    id: 'c2',
    name: 'Beans',
    icon: 'eco',
    type: 'cereal',
    pricePerKg: 160,
    units: [
      {
        type: 'korokoro',
        label: 'Korokoro',
        fractionPrices: createFractionPrices({ '1/8': 20, '1/4': 40, '1/2': 80, '1': 160 }),
      },
    ],
  },
  {
    id: 'c3',
    name: 'Groundnuts',
    icon: 'grain',
    type: 'cereal',
    pricePerKg: 220,
    units: [
      {
        type: 'korokoro',
        label: 'Korokoro',
        fractionPrices: createFractionPrices({ '1/8': 25, '1/4': 50, '1/2': 110, '1': 220 }),
      },
    ],
  },
  {
    id: 'c4',
    name: 'Sorghum',
    icon: 'water_drop',
    type: 'cereal',
    pricePerKg: 110,
    units: [
      {
        type: 'korokoro',
        label: 'Korokoro',
        fractionPrices: createFractionPrices({ '1/8': 15, '1/4': 30, '1/2': 55, '1': 110 }),
      },
    ],
  },
  {
    id: 'c5',
    name: 'Millet',
    icon: 'filter_vintage',
    type: 'cereal',
    pricePerKg: 145,
    units: [
      {
        type: 'korokoro',
        label: 'Korokoro',
        fractionPrices: createFractionPrices({ '1/8': 20, '1/4': 40, '1/2': 80, '1': 145 }),
      },
    ],
  },
]

export const POSHOMILL_SERVICES: PoshomillService[] = [
  {
    id: 'p1',
    name: 'Grade 1 Milling',
    icon: 'settings_suggest',
    pricePerKg: 20,
    units: [
      {
        type: 'kg',
        label: 'KG',
        fractionPrices: createFractionPrices({ '1/8': 3, '1/4': 5, '1/2': 10, '1': 20 }),
      },
    ],
  },
  {
    id: 'p2',
    name: 'Regular Milling',
    icon: 'shutter_speed',
    pricePerKg: 15,
    units: [
      {
        type: 'kg',
        label: 'KG',
        fractionPrices: createFractionPrices({ '1/8': 2, '1/4': 4, '1/2': 7, '1': 15 }),
      },
    ],
  },
]

export const BAG_PRODUCTS: BagProduct[] = [
  {
    id: 'b1',
    name: 'Plastic Bag',
    icon: 'shopping-bag',
    unitType: 'bag_size',
    variants: [
      { size: 'small', label: 'Small', price: 5 },
      { size: 'medium', label: 'Medium', price: 10 },
      { size: 'big', label: 'Big', price: 20 },
    ],
  },
  {
    id: 'b2',
    name: 'Woven Bag',
    icon: 'work-outline',
    unitType: 'bag_size',
    variants: [
      { size: 'small', label: 'Small', price: 10 },
      { size: 'medium', label: 'Medium', price: 20 },
      { size: 'big', label: 'Big', price: 40 },
    ],
  },
]

export const PACKAGING_SECTION = {
  title: 'Packaging',
  products: BAG_PRODUCTS,
}