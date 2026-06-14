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
          {/* Current Configuration Card */}
          <View style={styles.configCard}>
            <Text style={styles.sectionTitle}>Current Configuration</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Buying Unit</Text>
              <Text style={styles.value}>{item.buyingUnit}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Selling Unit</Text>
              <Text style={styles.value}>{item.sellingUnit}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Conversion Rate</Text>
              <Text style={styles.value}>
                1 {item.sellingUnit} = {item.conversionRate} {item.buyingUnit}
              </Text>
            </View>
          </View>
          
          {/* Derived Stock Display */}
          <View style={styles.derivedStock}>
            <Text>
              {item.currentStock} {item.buyingUnit} &rarr; {Math.floor(
                item.currentStock / item.conversionRate
              )} {item.sellingUnit} available
            </Text>
          </View>
        </ScrollView>
     </SafeAreaView>
   );
}

const styles = StyleSheet.create({
  configCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  value: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.onSurface,
  },
  derivedStock: {
    marginTop: 12,
    textAlign: 'center' as const,
  },
});