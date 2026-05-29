import { Text, View, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';

export default function SalesScreen() {
  return (
    <View className="flex-1 bg-gray-50 relative h-full" style={{ minHeight: '100vh' }}>
      <View className="flex-1">
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
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 180 }}>
          <Text className="text-lg font-medium text-neutral-700">Products coming soon</Text>
        </ScrollView>
      </View>
      <BottomNavBar activeTab="sales" />
    </View>
  );
}