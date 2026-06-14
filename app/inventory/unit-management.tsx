import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import TopAppBar from '../../components/layout/TopAppBar';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { INVENTORY_ITEMS } from '../../constants/inventoryData';
import { useDynamicProducts } from '../../context/DynamicProductsContext';

export default function UnitManagementScreen() {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { dynamicProducts, updateDynamicProduct } = useDynamicProducts();

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

  const [showEdit, setShowEdit] = useState(false);
  const [editBuyingUnit, setEditBuyingUnit] = useState(item.buyingUnit);
  const [editSellingUnit, setEditSellingUnit] = useState(item.sellingUnit);
  const [editConversionRate, setEditConversionRate] = useState(
    item.conversionRate.toString()
  );

  const handleSave = () => {
    const conversionRateNum = parseFloat(editConversionRate);
    if (isNaN(conversionRateNum) || conversionRateNum <= 0) {
      console.error('Invalid conversion rate');
      return;
    }
    const updatedItem = {
      ...item,
      buyingUnit: editBuyingUnit,
      sellingUnit: editSellingUnit,
      conversionRate: conversionRateNum,
    };
    const isDynamic = dynamicProducts.some(p => p.id === item.id);
    if (isDynamic) {
      updateDynamicProduct(updatedItem);
    } else {
      console.log('Seed item updated (not persisted):', updatedItem);
    }
    setShowEdit(false);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setEditBuyingUnit(item.buyingUnit);
    setEditSellingUnit(item.sellingUnit);
    setEditConversionRate(item.conversionRate.toString());
  };

  const buyingUnitOptions = ['kg', 'g', 'sack', 'piece'];
  const sellingUnitOptions = ['Korokoro', 'kg', 'g', 'piece'];

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

        {/* Edit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowEdit(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit Units</Text>
        </TouchableOpacity>

        {/* Edit Form */}
        {showEdit && (
          <View style={styles.editFormContainer}>
            <View style={styles.configCard}>
              <Text style={styles.sectionTitle}>Edit Configuration</Text>
              
              {/* Buying Unit Chips */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Buying Unit</Text>
                <View style={styles.chipGroup}>
                  {buyingUnitOptions.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setEditBuyingUnit(unit)}
                      style={[
                        styles.chip,
                        editBuyingUnit === unit
                          ? styles.chipSelected
                          : styles.chipUnselected,
                      ]}
                    >
                      <Text style={[styles.chipTextBase, { 
                        color: editBuyingUnit === unit ? Colors.primary : Colors.onSurfaceVariant,
                        fontWeight: editBuyingUnit === unit ? '600' : '400',
                      }]}>{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Selling Unit Chips */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Selling Unit</Text>
                <View style={styles.chipGroup}>
                  {sellingUnitOptions.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setEditSellingUnit(unit)}
                      style={[
                        styles.chip,
                        editSellingUnit === unit
                          ? styles.chipSelected
                          : styles.chipUnselected,
                      ]}
                    >
                      <Text style={[styles.chipTextBase, { 
                        color: editSellingUnit === unit ? Colors.primary : Colors.onSurfaceVariant,
                        fontWeight: editSellingUnit === unit ? '600' : '400',
                      }]}>{unit}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Conversion Rate Input */}
              <View>
                <Text style={styles.label}>Conversion Rate</Text>
                <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                  1 {editSellingUnit} = how many {editBuyingUnit}?
                </Text>
                <TextInput
                  placeholder="e.g. 2"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      borderColor: editConversionRate
                        ? Colors.primary
                        : '#e5e7eb',
                    },
                  ]}
                  value={editConversionRate}
                  onChangeText={setEditConversionRate}
                />
              </View>

              {/* Save and Cancel Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={[styles.buttonText, { color: Colors.onPrimary }]}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCancel}
                  style={styles.cancelButton}
                >
                  <Text style={[styles.buttonText, { color: Colors.onSurfaceVariant }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

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
  // New styles for edit functionality
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  editFormContainer: {
    marginTop: 24,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  chipSelected: {
    backgroundColor: Colors.primaryFixed,
    borderColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
   // We'll define chipTextBase and then override in the chip.
   chipTextBase: {
     fontSize: 14,
   },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.onSurface,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // For cancel button text color, we'll use a different color? Let's use onSurfaceVariant for now.
  // We'll adjust the cancel button text color separately.
});