export type BagType = 'plastic' | 'woven';

export type BagSize = 'small' | 'medium' | 'big';

export interface BagSizeOption {
  label: 'Small' | 'Medium' | 'Big';
  value: BagSize;
  priceMultiplier: number;
}

export interface BagTypeOption {
  label: 'Plastic' | 'Woven';
  value: BagType;
}

export const BAG_SIZES: BagSizeOption[] = [
  { label: 'Small', value: 'small', priceMultiplier: 0.5 },
  { label: 'Medium', value: 'medium', priceMultiplier: 1.0 },
  { label: 'Big', value: 'big', priceMultiplier: 2.0 },
];

export const BAG_TYPES: BagTypeOption[] = [
  { label: 'Plastic', value: 'plastic' },
  { label: 'Woven', value: 'woven' },
];

export const DEFAULT_BAG_TYPE: BagType = 'plastic';
export const DEFAULT_BAG_SIZE: BagSize = 'medium';