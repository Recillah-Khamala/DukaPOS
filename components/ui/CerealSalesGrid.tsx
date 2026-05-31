import { Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

export type CerealProduct = {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  priceKes: number;
};

const CEREAL_PRODUCTS: CerealProduct[] = [
  { id: 'maize', name: 'Maize', icon: 'grass', priceKes: 95 },
  { id: 'beans', name: 'Beans', icon: 'eco', priceKes: 160 },
  { id: 'groundnuts', name: 'Groundnuts', icon: 'grain', priceKes: 220 },
  { id: 'sorghum', name: 'Sorghum', icon: 'water_drop', priceKes: 110 },
  { id: 'millet', name: 'Millet', icon: 'filter_vintage', priceKes: 145 },
];

export default function CerealSalesGrid() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {CEREAL_PRODUCTS.map((product) => (
        <View
          key={product.id}
          className="w-[48%] rounded-xl bg-white p-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: Colors.primaryFixed }}>
            <MaterialIcons name={product.icon} size={28} color={Colors.primary} />
          </View>
          <Text className="mt-2 text-sm font-bold text-neutral-500">{product.name}</Text>
          <View className="mt-1 flex-row items-baseline gap-1">
            <Text className="text-[28px] font-extrabold" style={{ color: Colors.primary }}>
              {product.priceKes}
            </Text>
            <Text className="text-xs font-medium" style={{ color: Colors.primary }}>KES</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
