import { StyleSheet } from 'react-native';

// Set dark mode to class-based to allow manual color scheme setting
const styleSheetAny = StyleSheet as any;
if (styleSheetAny.setFlag) {
  styleSheetAny.setFlag('darkMode', 'class');
}

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, minHeight: '100vh' }}>
      <BasketProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'DukaPOS' }} />
          <Stack.Screen name="details" options={{ title: 'Details', presentation: 'modal' }} />
          <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
          <Stack.Screen name="checkout" options={{ title: 'Checkout', presentation: 'modal' }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="credit" options={{ title: 'Credit Book' }} />
        </Stack>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}
