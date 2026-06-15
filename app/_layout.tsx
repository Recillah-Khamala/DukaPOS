import '../global.css'; // ← add this as the very first import
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';
import { DynamicProductsProvider } from '../context/DynamicProductsContext';
import { InventoryProvider } from '../context/InventoryContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BasketProvider>
        <DynamicProductsProvider>
          <InventoryProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
              <Stack.Screen name="details" options={{ presentation: 'modal' }} />
            </Stack>
          </InventoryProvider>
        </DynamicProductsProvider>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}