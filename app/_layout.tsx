import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'DukaPOS' }} />
        <Stack.Screen name="details" options={{ title: 'Details' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
