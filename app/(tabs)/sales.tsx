import { Text, View, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';

type Product = {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  price: number;
};

const PRODUCTS: Product[] = [
  { name: 'Maize', icon: 'grass', price: 95 },
  { name: 'Beans', icon: 'eco', price: 160 },
  { name: 'Groundnuts', icon: 'grain', price: 220 },
  { name: 'Sorghum', icon: 'water-drop', price: 110 },
  { name: 'Millet', icon: 'filter-vintage', price: 145 },
];

export default function SalesScreen() {
  return (
    <>
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-4 pt-12 pb-3" style={{ backgroundColor: '#012d1d' }}>
          <View className="flex-row items-center gap-3 flex-1">
            <MaterialIcons name="storefront" size={24} color="white" />
            <Text className="text-lg font-semibold text-white">Kijiji Cereal Store</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="search" size={24} color="white" />
            <MaterialIcons name="notifications-none" size={24} color="white" />
          </View>
        </View>
        <ScrollView className="flex-1 px-4">
          <View className="flex-row items-center justify-between mt-4 mb-3">
            <Text className="text-lg font-semibold text-neutral-900">Cereal Sales</Text>
            <View className="flex-row rounded-full p-1" style={{ backgroundColor: Colors.secondaryContainer }}>
              <Pressable className="px-4 py-1.5 rounded-full" style={{ backgroundColor: Colors.primary }}>
                <Text className="text-xs font-bold text-white">KG</Text>
              </Pressable>
              <Pressable className="px-4 py-1.5 rounded-full">
                <Text className="text-xs font-medium" style={{ color: Colors.primary }}>Korokoro</Text>
              </Pressable>
            </View>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {PRODUCTS.map((product) => (
              <View
                key={product.name}
                className="w-[48%] rounded-xl mb-3"
                style={{
                  backgroundColor: Colors.white,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <View className="p-3 items-center">
                  <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: Colors.primaryFixed }}>
                    <MaterialIcons name={product.icon} size={24} color={Colors.primary} />
                  </View>
                  <Text className="text-sm font-bold text-neutral-700 mb-1">{product.name}</Text>
                  <Text className="text-xs text-neutral-500 mb-1">KES</Text>
                  <Text className="text-2xl font-extrabold" style={{ color: Colors.primary }}>{product.price}</Text>
                </View>
              </View>
            ))}
            <Pressable
              className="w-full rounded-xl items-center justify-center"
              style={{ height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.outline }}
            >
              <Text className="text-sm font-medium" style={{ color: Colors.primary }}>+ Add Custom Item</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      <BottomNavBar activeTab="sales" />
    </>
  );
}