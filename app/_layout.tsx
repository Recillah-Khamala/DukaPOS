import '../global.css'; // ← add this as the very first import
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';
import { DynamicProductsProvider } from '../context/DynamicProductsContext';
import { InventoryProvider } from '../context/InventoryContext';
import { CreditLedgerProvider } from '../context/CreditLedgerContext';
import { CustomersProvider } from '../context/CustomersContext';
import { useMigrateCustomerIds } from '../hooks/useMigrateCustomerIds';

// Runs the one-time legacy customer-id backfill. Must render inside both
// CreditLedgerProvider and CustomersProvider, so it's a child of the tree
// below rather than called directly in RootLayout.
function CustomerIdMigration() {
  useMigrateCustomerIds();
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BasketProvider>
        <DynamicProductsProvider>
          <InventoryProvider>
            <CreditLedgerProvider>
              <CustomersProvider>
                <CustomerIdMigration />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="details" options={{ presentation: 'modal' }} />
                </Stack>
              </CustomersProvider>
            </CreditLedgerProvider>
          </InventoryProvider>
        </DynamicProductsProvider>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}