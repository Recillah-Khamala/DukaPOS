import TabsLayout from './(tabs)/_layout';
import { View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1" style={{ minHeight: '100vh' }}>
      <TabsLayout />
    </View>
  );
}