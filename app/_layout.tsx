import { StyleSheet } from 'react-native';
import { Stack, Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BasketProvider } from '../context/BasketContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BasketProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}>
            {(props) => (
              <Tabs screenOptions={{ tabBarHideOnKeyboard: true }}>
                <Tabs.Screen name="sales" options={{ tabBarStyle: { display: 'none' } }} />
                <Tabs.Screen name="inventory" options={{ tabBarStyle: { display: 'none' } }} />
                <Tabs.Screen name="reports" options={{ tabBarStyle: { display: 'none' } }} />
                <Tabs.Screen name="credit" options={{ tabBarStyle: { display: 'none' } }} />
              </Tabs>
            )}
          </Stack.Screen>
          <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
          <Stack.Screen name="details" options={{ presentation: 'modal' }} />
        </Stack>
      </BasketProvider>
    </GestureHandlerRootView>
  );
}