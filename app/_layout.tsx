import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
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
