import { Tabs, useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { BottomNavTab } from '../../components/layout/BottomNavBar';

export default function TabsLayout() {
  const segments = useSegments();
  const router = useRouter();
  const currentTab = (segments[1] as BottomNavTab) || 'sales';

  const handleTabChange = (tab: BottomNavTab) => {
    router.push(`/(tabs)/${tab}` as any);
  };

  return (
    <View className="flex-1 bg-gray-50 relative" style={{ minHeight: '100vh' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="sales" />
        <Tabs.Screen name="inventory" />
        <Tabs.Screen name="reports" />
        <Tabs.Screen name="credit" />
      </Tabs>
      <BottomNavBar activeTab={currentTab} onTabChange={handleTabChange} />
    </View>
  );
}