import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.StyleSheet) {
      (window.StyleSheet as any).setFlag?.('darkMode', 'class');
    }
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ title: 'DukaPOS' }} />
        <Stack.Screen name="details" options={{ title: 'Details' }} />
        <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
