import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInventory } from '../../context/InventoryContext';
import Colors from '../../constants/colors';
import StockItemCard from '../../components/inventory/StockItemCard';

export default function UnitManagementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById } = useInventory();

  const itemId = id ?? '';
  const item = getItemById(itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.topAppBar}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="white"
            onPress={() => router.back()}
          />
          <Text style={styles.title}>Unit Management</Text>
        </View>
        <View style={styles.centeredMessage}>
          <Text>Item not found</Text>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.primary}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topAppBar}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Unit Management</Text>
      </View>
      <Text style={styles.subtitle}>{item.name}</Text>
       <ScrollView style={styles.scrollView}>
         <View style={styles.configCard}>
           <Text style={styles.configTitle}>Current Configuration</Text>
           <View style={styles.configRow}>
             <Text style={styles.configLabel}>Buying Unit</Text>
             <Text style={styles.configValue}>{item.buyingUnit}</Text>
           </View>
           <View style={styles.configDivider} />
           <View style={styles.configRow}>
             <Text style={styles.configLabel}>Selling Unit</Text>
             <Text style={styles.configValue}>{item.sellingUnit}</Text>
           </View>
           <View style={styles.configDivider} />
           <View style={styles.configRow}>
             <Text style={styles.configLabel}>Conversion Rate</Text>
             <Text style={styles.configValue}>
               1 {item.sellingUnit} = {item.conversionRate} {item.buyingUnit}
             </Text>
           </View>
         </View>
         <View style={styles.derivedStock}>
           {item.currentStock} {item.buyingUnit} in stock →{' '}
           {Math.floor(item.currentStock / item.conversionRate)} {item.sellingUnit} available
         </View>
       </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.primary,
  },
  title: { fontSize: 18, fontWeight: '600', color: 'white', flex: 1, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.onSurfaceVariant, paddingHorizontal: 16, paddingTop: 16 },
  scrollView: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { marginTop: 24 },
  configCard: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
    borderRadius: 8, // rounded-xl approx
    // shadow matching StockItemCard (we'll approximate)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  configTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  configDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  configLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  configValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  derivedStock: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
});