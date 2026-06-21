import { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';
import BulkStockEntryRow, { BulkStockEntryRowProps } from '../components/inventory/BulkStockEntryRow';
import { useInventory } from '../context/InventoryContext';
import { InventoryItem } from '../constants/inventoryData';

export default function BulkQuickAddScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [activeTab, setActiveTab] = useState('Cereals');
  const [deliveryAmounts, setDeliveryAmounts] = useState<Record<string, number>>({});

  const { allItems } = useInventory();

  const getFilteredItems = (): InventoryItem[] => {
    switch (activeTab) {
      case 'Cereals':
        return allItems.filter(item => item.category === 'cereal');
      case 'Bags':
        return allItems.filter(item => item.category === 'bags');
      case 'Services':
        return allItems.filter(item => item.category === 'poshomill');
      default:
        return [];
    }
  };

    const handleDeliveryAmountChange = (itemId: string, value: number) => {
      setDeliveryAmounts(prev => ({
        ...prev,
        [itemId]: value,
      }));
    };

   const totalUpdated = Object.values(deliveryAmounts).filter(v => v > 0).length;

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
          {getFilteredItems().map((item: InventoryItem) => (
            <BulkStockEntryRow
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                currentStock: item.currentStock,
                icon: item.icon ?? 'grain',
                status: item.isLowStock ? 'Low Stock' : undefined,
              }}
              deliveryAmount={deliveryAmounts[item.id] ?? 0}
              onDeliveryAmountChange={(value) => handleDeliveryAmountChange(item.id, value)}
            />
          ))}
        </View>
      </View>
       <View className="flex-row justify-between items-center px-6 py-2 bg-secondaryContainer">
         <Text className="font-medium text-onSurface">
           Total Items Updated: {totalUpdated}
         </Text>
         <TouchableOpacity onPress={() => console.log('Save all changes', deliveryAmounts)} className="px-4 py-2 rounded-md" style={{ backgroundColor: Colors.primary }}>
           <Text className="text-sm font-medium text-white">Save All Changes</Text>
         </TouchableOpacity>
       </View>
       <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
     </View>
   );
 }