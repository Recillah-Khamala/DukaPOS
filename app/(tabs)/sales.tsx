import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomNavBar from '../../components/layout/BottomNavBar';
import CerealSalesGrid from '../../components/ui/CerealSalesGrid';

type UnitToggle = 'kg' | 'korokoro';

function UnitTogglePill({ value, onChange }: { value: UnitToggle; onChange: (v: UnitToggle) => void }) {
  return (
    <View className="flex-row items-center rounded-full p-1" style={{ backgroundColor: '#ffb702' }}>
      {(['kg', 'korokoro'] as UnitToggle[]).map((unit) => {
        const active = value === unit;
        return (
          <Pressable
            key={unit}
            onPress={() => onChange(unit)}
            className="h-8 items-center justify-center rounded-full px-3"
            style={{ backgroundColor: active ? '#012d1d' : 'transparent' }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? 'white' : 'black' }}
            >
              {unit === 'kg' ? 'KG' : 'Korokoro'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SalesScreen() {
  const [unit, setUnit] = React.useState<UnitToggle>('kg');

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: '#012d1d' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <MaterialIcons name="storefront" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialIcons name="search" size={24} color="white" />
          <MaterialIcons name="notifications-none" size={24} color="white" />
        </View>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 180 }}>
        <View className="flex-row items-center justify-between mt-6 mb-4">
          <Text className="text-lg font-bold" style={{ color: '#191c1d' }}>Cereal Sales</Text>
          <UnitTogglePill value={unit} onChange={setUnit} />
        </View>
        <CerealSalesGrid />
        <Pressable className="mt-4 w-full items-center justify-center rounded-xl border-2 border-dashed py-4" style={{ borderColor: '#c1c8c2', backgroundColor: '#eceef1', height: 56 }}>
          <Text className="text-base font-semibold" style={{ color: '#717973' }}>+ Add Custom Item</Text>
        </Pressable>
      </ScrollView>
      <BottomNavBar activeTab="sales" />
    </View>
  );
}
