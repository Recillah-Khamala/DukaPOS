import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sales" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="credit" />
    </Stack>
  );
}