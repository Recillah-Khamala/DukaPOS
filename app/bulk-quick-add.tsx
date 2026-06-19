import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';

export default function BulkQuickAddScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Bulk Quick Add" onBack={() => router.back()} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-neutral-500">Bulk Quick Add Screen - Placeholder</Text>
      </View>
      <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}