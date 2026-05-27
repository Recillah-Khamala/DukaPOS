import { Text, View, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';

export default function SalesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      <View
        className="flex-row items-center justify-between px-4"
        style={{
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: 12,
          backgroundColor: '#012d1d',
        }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <MaterialIcons name="storefront" size={24} color="white" />
          <Text className="text-lg font-semibold text-white">Kijiji Cereal Store</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="search" size={24} color="white" />
          <MaterialIcons name="notifications-none" size={24} color="white" />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <View className="items-center justify-center flex-1 pt-20">
          <Text className="text-xl font-medium text-neutral-700">
            Products coming soon
          </Text>
        </View>
      </ScrollView>
      <BottomNavBar activeTab="sales" />
    </View>
  );
}