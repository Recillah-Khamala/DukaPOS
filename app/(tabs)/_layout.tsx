import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tabs.Screen name="sales" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="inventory" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="reports" options={{ tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="credit" options={{ tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}
