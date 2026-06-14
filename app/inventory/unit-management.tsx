import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { TopAppBar } from '../../components/layout/TopAppBar';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { INVENTORY_ITEMS } from '../../constants/inventoryData';
import { useDynamicProducts } from '../../context/DynamicProductsContext';

export default function UnitManagementScreen() {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { dynamicProducts } = useDynamicProducts();

  // Find item in static inventory or dynamic products
  const item =
    INVENTORY_ITEMS.find(i => i.id === id) ||
    dynamicProducts.find(i => i.id === id);

  if (!item) {
    // Fallback: render not found
     return (
       <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }}>
         <TopAppBar title="Unit Management" onBack={() => router.back()} />
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Text>Item not found</Text>
         </View>
       </SafeAreaView>
     );
  }

   return (
     <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }}>
       <TopAppBar title="Unit Management" onBack={() => router.back()} />
       <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
         <Text
           style={{
             fontSize: 16,
             color: Colors.onSurfaceVariant,
           }}
         >
           {item.name}
         </Text>
       </View>
       <ScrollView
         contentContainerStyle={{
           paddingHorizontal: 16,
           paddingTop: 24,
         }}
       >
         {/* Placeholder for future content */}
         <View style={{ height: 200, backgroundColor: '#f3f4f6', borderRadius: 8 }} />
       </ScrollView>
     </SafeAreaView>
   );
}

const styles = StyleSheet.create({});