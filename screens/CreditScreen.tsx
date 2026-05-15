import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';

export default function CreditScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('credit');
  const router = useRouter();

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'sales') {
      router.push('/');
    } else if (tab === 'inventory') {
      router.push('/inventory');
    } else if (tab === 'reports') {
      router.push('/reports');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Credit Book" />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-medium text-neutral-700">
          Credit tracking coming soon
        </Text>
      </View>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}