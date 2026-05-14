import { useState } from 'react';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('sales');

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Text className="text-2xl font-semibold text-neutral-900">DukaPOS</Text>
        <Text className="px-2 text-center text-base text-neutral-500">
          NativeWind v4 with Tailwind CSS and expo-router
        </Text>
        <Text className="mt-4 text-lg font-medium text-neutral-700">
          Active Tab: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Text>
        <Link href="/details" className="mt-2 text-lg font-medium text-blue-600">
          Go to details
        </Link>
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <StatusBar style="auto" />
    </View>
  );
}
