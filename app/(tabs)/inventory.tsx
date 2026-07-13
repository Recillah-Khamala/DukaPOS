import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useInventory } from '../../context/InventoryContext';
import { CerealInventorySection } from './cereal-inventory-section';
import { BagInventorySection } from './bag-inventory-section';
import { BottomNavBar } from '../../components/layout/BottomNavBar';
import { Colors } from '../../constants/colors';

export default function InventoryScreen() {
  const { allItems, loading } = useInventory();
  const cerealItems = allItems.filter(item => item.category === 'cereal');
  const bagItems = allItems.filter(item => item.category === 'bag');

  // Calculate low stock items (less than 10 units)
  const lowStockItems = allItems.filter(item => currentStock < 10);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.onSurfaceVariant }}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <CerealInventorySection cerealItems={cerealItems} lowStockItems={lowStockItems} />
      <BagInventorySection bagItems={bagItems} lowStockItems={lowStockItems} />
      <BottomNavBar activeTab="inventory" />
    </View>
  );
}