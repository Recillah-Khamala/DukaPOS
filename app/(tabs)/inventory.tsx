import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';

export default function InventoryScreen() {
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

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
          <MaterialIcons name="inventory_2" size={24} color="white" />
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
        {/* Content will be added later */}
      </ScrollView>

      <BottomNavBar activeTab="inventory" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}