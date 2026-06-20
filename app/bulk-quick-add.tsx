// app/bulk-quick-add.tsx
import { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';
import BulkStockEntryRow, { BulkStockEntryRowProps } from '../components/inventory/BulkStockEntryRow';

export default function BulkQuickAddScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [activeTab, setActiveTab] = useState('Cereals');

  const mockItems: BulkStockEntryRowProps['product'][] = [
    { id: '1', name: 'Maize Meal', currentStock: 25, icon: 'grass', status: 'Low Stock' },
    { id: '2', name: 'Wheat Flour', currentStock: 100, icon: 'grain' },
    { id: '3', name: 'Sugar', currentStock: 50, icon: 'eco', status: 'High Demand' },
    { id: '4', name: 'Rice', currentStock: 75, icon: 'grain' },
  ];

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
        <ScrollView horizontal className="py-2">
          {['Cereals', 'Bags', 'Services'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: activeTab === tab ? Colors.primary : Colors.secondaryContainer,
                marginRight: tab === 'Services' ? 0 : 8,
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? 'white' : Colors.onSecondaryContainer,
                  fontWeight: activeTab === tab ? '600' : '400',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="mt-6">
          {mockItems.map((item) => (
            <BulkStockEntryRow key={item.id} product={item} />
          ))}
        </View>
      </View>
      <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}