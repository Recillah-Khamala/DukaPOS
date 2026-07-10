import '../global.css'; // ← add this as the very first import
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';
import { DynamicProductsProvider } from '../context/DynamicProductsContext';
import { InventoryProvider } from '../context/InventoryContext';
import { CreditLedgerProvider } from '../context/CreditLedgerContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BasketProvider>
        <DynamicProductsProvider>
          <InventoryProvider>
            <CreditLedgerProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
                <Stack.Screen name="details" options={{ presentation: 'modal' }} />
              </Stack>
            </CreditLedgerProvider>
          </InventoryProvider>
        </DynamicProductsProvider>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}