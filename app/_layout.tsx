import { StyleSheet } from 'react-native';

// Set dark mode to class-based to allow manual color scheme setting
const styleSheetAny = StyleSheet as any;
if (styleSheetAny.setFlag) {
  styleSheetAny.setFlag('darkMode', 'class');
}

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-gray-50" style={{ minHeight: '100vh' }}>
      <BasketProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="details" options={{ presentation: 'modal' }} />
          <Stack.Screen name="inventory" />
          <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
          <Stack.Screen name="reports" />
          <Stack.Screen name="credit" />
        </Stack>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}
