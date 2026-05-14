import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-white px-6">
      <Text className="text-2xl font-semibold text-neutral-900">DukaPOS</Text>
      <Text className="px-2 text-center text-base text-neutral-500">
        NativeWind v4 with Tailwind CSS and expo-router
      </Text>
      <Link href="/details" className="mt-2 text-lg font-medium text-blue-600">
        Go to details
      </Link>
      <StatusBar style="auto" />
    </View>
  );
}
