import { Stack, useRouter, useSegments } from 'expo-router';
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
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f9fafb' },
        }}
      >
        <Stack.Screen name="sales" />
        <Stack.Screen name="inventory" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="credit" />
      </Stack>
      <BottomNavBar activeTab={currentTab} onTabChange={handleTabChange} />
    </>
  );
}