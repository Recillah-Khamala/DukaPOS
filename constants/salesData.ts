export type CerealProduct = {
  id: string
  name: string
  pricePerKg: number
  price: number
  icon: string
  type: 'cereal'
  unit?: string
  stockLevel?: number
}

export type PoshomillService = {
  id: string
  name: string
  pricePerKg: number
  icon: string
}

export const CEREAL_PRODUCTS: CerealProduct[] = [
  { id: 'c1', name: 'Maize',      pricePerKg: 95,  price: 95,  icon: 'grass',          type: 'cereal', unit: 'kg' },
  { id: 'c2', name: 'Beans',      pricePerKg: 160, price: 160, icon: 'eco',            type: 'cereal', unit: 'kg' },
  { id: 'c3', name: 'Groundnuts', pricePerKg: 220, price: 220, icon: 'grain',          type: 'cereal', unit: 'kg' },
  { id: 'c4', name: 'Sorghum',    pricePerKg: 110, price: 110, icon: 'water_drop',     type: 'cereal', unit: 'kg' },
  { id: 'c5', name: 'Millet',     pricePerKg: 145, price: 145, icon: 'filter_vintage', type: 'cereal', unit: 'kg' },
]

export const POSHOMILL_SERVICES: PoshomillService[] = [
  { id: 'p1', name: 'Grade 1 Milling', pricePerKg: 20, icon: 'settings_suggest' },
  { id: 'p2', name: 'Regular Milling',  pricePerKg: 15, icon: 'shutter_speed'    },
]
