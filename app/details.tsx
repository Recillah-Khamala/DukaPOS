import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function DetailsScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-center text-base text-neutral-600">
        This screen exists to show stack navigation.
      </Text>
      <Link href="/" className="text-lg font-medium text-blue-600">
        Back to home
      </Link>
    </View>
  );
}
