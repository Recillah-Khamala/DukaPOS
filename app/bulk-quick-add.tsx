import { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

  const { allItems, getItemById, updateItem } = useInventory();

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

const handleSaveAllChanges = () => {
    Object.entries(deliveryAmounts).forEach(([itemId, deliveryAmount]) => {
      if (deliveryAmount > 0) {
        const item = getItemById(itemId);
        if (!item) return;
        const rate = item.conversionRate ?? 1;
        // For cereals, stock is stored in sellingUnit (Korokoro)
        // deliveryAmount is entered in buyingUnit
        // For bags, conversionRate is 1 so this is a no-op
        const addedInStorageUnit = deliveryAmount * rate;
        const newStock = item.currentStock + addedInStorageUnit;
        updateItem(itemId, {
          currentStock: newStock,
          isLowStock: newStock <= item.lowStockThreshold,
        });
      }
    });
    Alert.alert('Success', 'Stock updated', [
      {
        text: 'OK',
        onPress: () => {
          setDeliveryAmounts({});
          router.back();
        },
      },
    ]);
  };

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
{getFilteredItems().length > 0 ? (
  <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
{getFilteredItems().map((item: InventoryItem) => (
       <BulkStockEntryRow
         key={item.id}
         product={{
           id: item.id,
           name: item.name,
           currentStock: item.currentStock,
           icon: item.icon ?? 'grain',
           status: item.isLowStock ? 'Low Stock' : undefined,
           sellingUnit: item.sellingUnit,
           buyingUnit: item.buyingUnit,
         }}
         deliveryAmount={deliveryAmounts[item.id] ?? 0}
         onDeliveryAmountChange={(value) => handleDeliveryAmountChange(item.id, value)}
       />
     ))}
  </ScrollView>
) : (
  <View className="mt-6 items-center justify-center">
    <Text className="text-onSurfaceVariant text-center">
      No items in this category
    </Text>
  </View>
)}
      </View>
<View className="flex-row justify-between items-center px-6 py-2 bg-secondaryContainer" style={{ marginBottom: bottomNavHeight }}>
           <Text className="font-medium text-onSurface">
             Total Items Updated: {totalUpdated}
           </Text>
           <TouchableOpacity
             onPress={handleSaveAllChanges}
             disabled={totalUpdated === 0}
             className="px-4 py-2 rounded-md"
             style={{
               backgroundColor: totalUpdated === 0 ? '#d1d5db' : Colors.primary,
             }}
           >
             <Text
               className="text-sm font-medium"
               style={{ color: totalUpdated === 0 ? '#9ca3af' : Colors.onPrimary }}
             >
               Save All Changes
             </Text>
           </TouchableOpacity>
         </View>
       <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
     </View>
   );
 }