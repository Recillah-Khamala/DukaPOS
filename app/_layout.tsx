import { StyleSheet } from 'react-native';

const styleSheetAny = StyleSheet as any;
if (styleSheetAny.setFlag) {
  styleSheetAny.setFlag('darkMode', 'class');
}

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BasketProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'DukaPOS' }} />
          <Stack.Screen name="details" options={{ title: 'Details' }} />
          <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
          <Stack.Screen name="checkout" options={{ title: 'Checkout', presentation: 'modal' }} />
          <Stack.Screen name="reports" options={{ title: 'Reports' }} />
          <Stack.Screen name="credit" options={{ title: 'Credit Book' }} />
        </Stack>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}
