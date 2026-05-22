import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="sales" options={{ title: 'Sales' }} />
        <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
        <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
        <Tabs.Screen name="credit" options={{ title: 'Credit' }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}
