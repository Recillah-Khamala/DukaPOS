import { Text, View } from 'react-native';
import TopAppBar from '../../components/layout/TopAppBar';

export default function CreditScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Credit Book" />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-medium text-neutral-700">
          Credit tracking coming soon
        </Text>
      </View>
    </View>
  );
}