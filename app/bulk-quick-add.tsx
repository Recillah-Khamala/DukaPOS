import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../../constants/colors';

export default function BulkQuickAddScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Bulk Quick Add" onBack={() => router.back()} />
      <View className="flex-1 px-6 pt-6">
        <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.onSurface }}>
          Bulk Stock Entry
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '400', color: Colors.onSurfaceVariant }}>
          Enter multiple stock items quickly by scanning or typing.
        </Text>
        {/* Future content will go here */}
      </View>
      <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}