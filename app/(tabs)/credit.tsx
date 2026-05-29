import { Text, View } from 'react-native';
import { useState } from 'react';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';

export default function CreditScreen() {
  const [bottomHeight, setBottomHeight] = useState(0);

  return (
    <View className="flex-1 bg-gray-50 relative">
      <TopAppBar title="Credit Book" />
      <View className="flex-1 items-center justify-center px-4" style={{ paddingBottom: bottomHeight + 16 }}>
        <Text className="text-xl font-medium text-neutral-700">
          Credit tracking coming soon
        </Text>
      </View>
      <BottomNavBar activeTab="credit" onHeightMeasured={setBottomHeight} />
    </View>
  );
}