import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable, TouchableOpacity, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import { useInventory } from '../../context/InventoryContext';
import StockItemCard from '../../components/inventory/StockItemCard';
import AddStockModal from '../../components/inventory/AddStockModal';

export default function InventoryScreen() {
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [showAddStock, setShowAddStock] = useState(false);
  const { allItems } = useInventory();
  const lowStockItems = allItems.filter(item => item.isLowStock);
  const router = useRouter();

  // No need for handleAddItem as AddStockModal now updates context via DynamicProductsContext

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
       {/* Top App Bar */}
       <View style={{
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         paddingHorizontal: 16,
         paddingTop: 48,
         paddingBottom: 12,
         backgroundColor: Colors.primary,
       }}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
           <MaterialIcons name="inventory" size={24} color="white" />
           <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Inventory Management</Text>
         </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ backgroundColor: Colors.primaryFixed, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialIcons name="inventory" size={14} color={Colors.primary} />
                <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.primary }}>
                  {allItems.length} Items Total
                </Text>
              </View>
            </View>
            <MaterialIcons name="search" size={24} color="white" />
            <MaterialIcons name="more_vert" size={24} color="white" onPress={() => Alert.alert('Menu', 'Coming soon')} />
          </View>
       </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: bottomNavHeight + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Low Stock Alerts section */}
        {lowStockItems.length > 0 && (
          <View style={{ backgroundColor: '#fefce8', borderWidth: 1.5, borderColor: '#fbbf24', borderRadius: 16, padding: 12, marginHorizontal: 16, marginBottom: 8 }}>
            {lowStockItems.map((item, index) => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: index === lowStockItems.length - 1 ? 0 : 1, borderBottomColor: '#fde68a' }}>
                <MaterialIcons name={item.icon || 'grain'} size={20} color='#d97706' style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.onSurface }}>{item.name}</Text>
                  {item.description && <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant }}>{item.description}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#dc2626' }}>{item.currentStock}</Text>
                  <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant }}>{item.sellingUnit}</Text>
                  <View style={{ backgroundColor: '#dc2626', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: 'white' }}>Critically Low</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
         {/* Cereal Inventory section */}
         <View style={{ paddingHorizontal: 16 }}>
           <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.primary }}>
             Cereal Inventory
           </Text>
           <View style={{ flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 12 }}>
             <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.primary, borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }} onPress={() => setShowAddStock(true)}>
               <MaterialIcons name="add_circle" size={20} color="white" />
               <Text style={{ color: 'white', fontWeight: '600' }}>Add Stock</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{ flex: 1, backgroundColor: Colors.secondaryContainer, borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }} onPress={() => console.log('Update Prices pressed')}>
               <MaterialIcons name="edit_square" size={20} color={Colors.onSecondaryContainer} />
               <Text style={{ color: Colors.onSecondaryContainer, fontWeight: '600' }}>Update Prices</Text>
             </TouchableOpacity>
           </View>

           {/* Inventory list or empty state */}
            {allItems.length === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 48 }}>
                <MaterialIcons name="inventory" size={48} color="#d1d5db" />
                <Text style={{ fontSize: 15, color: "#9ca3af", marginTop: 8 }}>
                  No inventory items yet
                </Text>
              </View>
            ) : (
              <>
                {allItems.map(item => (
                  <Pressable key={item.id} onPress={() => router.push({ pathname: '/inventory/unit-management', params: { id: item.id } })}>
                    <StockItemCard item={item} />
                  </Pressable>
                ))}
              </>
             )}
         </View>
         {/* Bags Inventory section */}
         <View style={{ paddingHorizontal: 16 }}>
           <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.primary }}>
             Bags Inventory
           </Text>
           {/* Inventory list or empty state for bags */}
           {allItems.filter(item => item.category === 'bags').length === 0 ? (
             <View style={{ alignItems: 'center', paddingTop: 48 }}>
               <MaterialIcons name="inventory" size={48} color="#d1d5db" />
               <Text style={{ fontSize: 15, color: "#9ca3af", marginTop: 8 }}>
                 No bag items yet
               </Text>
             </View>
           ) : (
             <>
               {allItems
                 .filter(item => item.category === 'bags')
                 .map(item => (
                   <Pressable key={item.id} onPress={() => router.push({ pathname: '/inventory/unit-management', params: { id: item.id } })}>
                     <StockItemCard item={item} />
                   </Pressable>
                 ))}
             </>
           )}
         </View>
         {/* Content will be added later */}
        </ScrollView>

        <AddStockModal visible={showAddStock} onClose={() => setShowAddStock(false)} />

       <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}