import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInventory } from '../../context/InventoryContext';
import Colors from '../../constants/colors';
import StockItemCard from '../../components/inventory/StockItemCard';

export default function UnitManagementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById, updateItem } = useInventory();

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

const [showEdit, setShowEdit] = React.useState(false);
  const [editBuyingUnit, setEditBuyingUnit] = React.useState<'kg' | 'g' | 'sack' | 'piece'>(item.buyingUnit as 'kg' | 'g' | 'sack' | 'piece');
  const [editSellingUnit, setEditSellingUnit] = React.useState<'Korokoro' | 'kg' | 'g' | 'piece'>(item.sellingUnit as 'Korokoro' | 'kg' | 'g' | 'piece');
  const [editConversionRate, setEditConversionRate] = React.useState<string>(item.conversionRate.toString());
  const [editConversionRateError, setEditConversionRateError] = React.useState<string | null>(null);
  const [editLowStockThreshold, setEditLowStockThreshold] = React.useState<string>(item.lowStockThreshold.toString());
  const [editLowStockThresholdError, setEditLowStockThresholdError] = React.useState<string | null>(null);

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
           <View style={styles.configDivider />
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
           <View style={styles.configDivider} />
           <View style={styles.configRow}>
             <Text style={styles.configLabel}>Low Stock Alert Below</Text>
             <Text style={styles.configValue}>{item.lowStockThreshold} {item.sellingUnit}</Text>
           </View>
         </View>
          <View style={styles.configDivider} />
<View style={styles.configRow}>
             <Text style={styles.configLabel}>Conversion Rate</Text>
             <Text style={styles.configValue}>{item.conversionRate}</Text>
           </View>
           <View style={styles.configDivider} />
           <View style={styles.configRow}>
             <Text style={styles.configLabel}>Low Stock Alert Below</Text>
             <Text style={styles.configValue}>{item.lowStockThreshold} {item.sellingUnit}</Text>
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

        {!showEdit ? (
          <Pressable onPress={() => setShowEdit(true)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Units</Text>
          </Pressable>
        ) : (
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Unit Configuration</Text>
            <Text style={styles.editSubtitle}>Buying Unit</Text>
            <View style={styles.editChipRow}>
              {['kg', 'g', 'sack', 'piece'].map((unit) => (
                <Pressable
                  key={unit}
                  onPress={() => setEditBuyingUnit(unit as 'kg' | 'g' | 'sack' | 'piece')}
                  style={[
                    styles.editChip,
                    editBuyingUnit === unit ? styles.editChipSelected : styles.editChipUnselected,
                  ]}
                >
                  <Text style={editBuyingUnit === unit ? styles.editChipTextSelected : styles.editChipTextUnselected}>
                    {unit}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.editSubtitle, { marginTop: 12 }]}>
              Selling Unit
            </Text>
            <View style={styles.editChipRow}>
              {['Korokoro', 'kg', 'g', 'piece'].map((unit) => (
                <Pressable
                  key={unit}
                  onPress={() => setEditSellingUnit(unit as 'Korokoro' | 'kg' | 'g' | 'piece')}
                  style={[
                    styles.editChip,
                    editSellingUnit === unit ? styles.editChipSelected : styles.editChipUnselected,
                  ]}
                >
                  <Text style={editSellingUnit === unit ? styles.editChipTextSelected : styles.editChipTextUnselected}>
                    {unit}
                  </Text>
                </Pressable>
              ))}
            </View>
<View style={{ marginTop: 12 }}>
                <Text style={styles.editSubtitle}>Conversion Rate</Text>
                <TextInput
                  style={styles.editInput}
                  value={editConversionRate}
                  onChangeText={setEditConversionRate}
                  keyboardType="numeric"
                  placeholder="1.0"
                  placeholderTextColor="#9ca3af"
                />
                {editConversionRateError && (
                  <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                    {editConversionRateError}
                  </Text>
                )}
                <Text style={styles.editHint}>
                  1 {editSellingUnit} = how many {editBuyingUnit}?
                </Text>
              </View>
              <View style={{ marginTop: 12 }}>
                <Text style={styles.editSubtitle}>Low Stock Alert Below</Text>
                <TextInput
                  style={styles.editInput}
                  value={editLowStockThreshold}
                  onChangeText={setEditLowStockThreshold}
                  keyboardType="numeric"
                  placeholder="15"
                  placeholderTextColor="#9ca3af"
                />
                {editLowStockThresholdError && (
                  <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                    {editLowStockThresholdError}
                  </Text>
                )}
<Text style={styles.editHint}>
                 You'll be alerted when stock drops to this level (in {item.sellingUnit})
               </Text>
              </View>
            <View style={styles.editButtonRow}>
              <Pressable onPress={() => setShowEdit(false)} style={styles.editCancelButton}>
                <Text style={styles.editCancelButtonText}>Cancel</Text>
              </Pressable>
<Pressable onPress={() => {
                 // Validate conversion rate
                 const conversionRateNum = parseFloat(editConversionRate);
                 const isValidConversionRate =
                   !isNaN(conversionRateNum) && conversionRateNum > 0;
                 
                 // Validate low stock threshold
                 const newThreshold = parseFloat(editLowStockThreshold);
                 const isValidThreshold =
                   !isNaN(newThreshold) && newThreshold > 0;
                 
                 // Set errors
                 setEditConversionRateError(
                   isValidConversionRate ? null : 'Must be a positive number'
                 );
                 setEditLowStockThresholdError(
                   isValidThreshold ? null : 'Must be a positive number'
                 );
                 
                 // If valid, update the item
                 if (isValidConversionRate && isValidThreshold) {
                   updateItem(item.id, {
                     buyingUnit: editBuyingUnit,
                     sellingUnit: editSellingUnit,
                     conversionRate: conversionRateNum,
                     lowStockThreshold: newThreshold,
                     isLowStock: item.currentStock <= newThreshold,
                   });
                   setShowEdit(false);
                 }
               }} style={styles.editSaveButton}>
                 <Text style={styles.editSaveButtonText}>Save Changes</Text>
               </Pressable>
            </View>
          </View>
        )}
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
  // Edit button
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Edit card
  editCard: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  editTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 16,
  },
  editSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  editChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  editChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  editChipSelected: {
    backgroundColor: Colors.primaryFixed,
    borderColor: Colors.primary,
  },
  editChipUnselected: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  editChipTextSelected: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  editChipTextUnselected: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '400',
  },
  editInput: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.onSurface,
  },
  editHint: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  editButtonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  editCancelButton: {
    flex: 1,
    backgroundColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
  },
  editSaveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 8,
  },
  editCancelButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  editSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.onPrimary,
  },
});