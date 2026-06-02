export type CerealProduct = {
  id: string
  name: string
  pricePerKg: number
  icon: string
}

export type PoshomillService = {
  id: string
  name: string
  pricePerKg: number
  icon: string
}

export const CEREAL_PRODUCTS: CerealProduct[] = [
  { id: 'c1', name: 'Maize',      pricePerKg: 95,  icon: 'grass'          },
  { id: 'c2', name: 'Beans',      pricePerKg: 160, icon: 'eco'            },
  { id: 'c3', name: 'Groundnuts', pricePerKg: 220, icon: 'grain'          },
  { id: 'c4', name: 'Sorghum',    pricePerKg: 110, icon: 'water_drop'     },
  { id: 'c5', name: 'Millet',     pricePerKg: 145, icon: 'filter_vintage' },
]

export const POSHOMILL_SERVICES: PoshomillService[] = [
  { id: 'p1', name: 'Grade 1 Milling', pricePerKg: 20, icon: 'settings_suggest' },
  { id: 'p2', name: 'Regular Milling',  pricePerKg: 15, icon: 'shutter_speed'    },
]
