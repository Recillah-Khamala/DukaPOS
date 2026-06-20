import { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';

export default function BulkQuickAddScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [activeTab, setActiveTab] = useState('Cereals');

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Bulk Quick Add" onBack={() => router.back()} />
      <View className="flex-1 px-6 pt-6">
        <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.onSurface }}>
          Bulk Stock Entry
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '400', color: Colors.onSurfaceVariant }}>
          Update inventory levels for new deliveries quickly. Adjust quantities or type values directly.
        </Text>
        <ScrollView horizontal className="py-2 space-x-2">
          {['Cereals', 'Bags', 'Services'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: activeTab === tab ? Colors.primary : Colors.secondaryContainer,
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? Colors.white : Colors.onSecondaryContainer,
                  fontWeight: activeTab === tab ? '600' : '400',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Future content will go here */}
      </View>
      <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}