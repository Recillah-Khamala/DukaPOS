import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar, { BottomNavTab } from '../../components/layout/BottomNavBar';

export default function CreditScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Credit Book" />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-medium text-neutral-700">
          Credit tracking coming soon
        </Text>
      </View>
      <BottomNavBar activeTab="credit" onTabChange={(tab) => {
        if (tab === 'sales') router.push('/');
        else if (tab === 'inventory') router.push('/inventory');
        else if (tab === 'reports') router.push('/reports');
        else if (tab === 'credit') router.push('/credit');
      }} />
    </View>
  );
}