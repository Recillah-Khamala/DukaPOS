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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BasketProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="details" options={{ title: 'Details', presentation: 'modal' }} />
          <Stack.Screen name="checkout" options={{ title: 'Checkout', presentation: 'modal' }} />
        </Stack>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}
