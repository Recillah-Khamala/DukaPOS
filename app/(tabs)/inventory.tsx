import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
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
        <MaterialIcons name="search" size={24} color="white" />
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
          <>
            <Text 
              style={{ 
                textTransform: 'uppercase', 
                fontSize: 11, 
                fontWeight: '500', 
                color: Colors.onSurfaceVariant, 
                paddingHorizontal: 16, 
                marginBottom: 8 
              }}>
              Low Stock Alerts
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={{ paddingHorizontal: 16, gap: 8 }}
              contentContainerStyle={{ flexDirection: 'row' }}
            >
              {lowStockItems.map(item => (
                <View 
                  key={item.id} 
                  style={{
                    backgroundColor: '#fef2f2',
                    borderColor: '#fca5a5',
                    borderWidth: 1,
                    borderRadius: 9999, // rounded-full
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <MaterialIcons name="warning" size={14} color='#dc2626' />
                    <Text 
                     style={{ 
                       fontSize: 13, 
                       fontWeight: '600', 
                       color: '#dc2626' 
                     }}>
                     {item.name} · {item.currentStock} {item.sellingUnit}
                   </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
        {/* Cereal Inventory section */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Section heading */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.primary }}>
              Cereal Inventory
            </Text>
            <View style={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}>
               <Text
                 style={{ fontSize: 13, fontWeight: '600', color: Colors.onPrimary }}
                 onPress={() => setShowAddStock(true)}
               >
                + Add Stock
              </Text>
            </View>
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
        {/* Content will be added later */}
       </ScrollView>

        <AddStockModal visible={showAddStock} onClose={() => setShowAddStock(false)} />

       <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}