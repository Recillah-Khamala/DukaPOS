import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLayoutEffect } from 'react';

export default function RootLayout() {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const StyleSheet = (window as any).StyleSheet;
      if (StyleSheet && StyleSheet.setFlag) {
        StyleSheet.setFlag('darkMode', 'class');
      }
    }
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ title: 'DukaPOS' }} />
        <Stack.Screen name="details" options={{ title: 'Details' }} />
        <Stack.Screen name="inventory" options={{ title: 'Inventory' }} />
        <Stack.Screen name="reports" options={{ title: 'Reports' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
