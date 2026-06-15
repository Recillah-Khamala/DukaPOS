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
        {/* We'll show the item in a card for now; further unit management UI can be added later */}
        <StockItemCard item={item} />
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
});