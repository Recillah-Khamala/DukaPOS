import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFuelLog } from '../hooks/useFuelLog';
import TopAppBar from '../components/layout/TopAppBar';
import Card from '../components/ui/Card';
import Colors from '../constants/colors';
import { useRouter } from 'expo-router';
import FuelEntryCard from '../components/ui/FuelEntryCard';
import EmptyStateCard from '../components/ui/EmptyStateCard';

export default function FuelLogScreen() {
  const { entries, loading, addEntry } = useFuelLog();
  const router = useRouter();

  const [showModal, setShowModal] = React.useState(false);
  const [fuelType, setFuelType] = React.useState<'diesel' | 'electricity'>('diesel');
  const [fuelQty, setFuelQty] = React.useState('');
  const [fuelCostPerUnit, setFuelCostPerUnit] = React.useState('');
  const [fuelNote, setFuelNote] = React.useState('');
  const [buyMode, setBuyMode] = React.useState<'by-litres' | 'by-amount'>('by-litres');

  const handleAddFuelEntry = () => {
    const cpu = parseFloat(fuelCostPerUnit);
    if (!cpu) return;
    let qty: number;
    let totalCost: number;
    if (buyMode === 'by-litres') {
      const q = parseFloat(fuelQty);
      if (!q) return;
      qty = q;
      totalCost = qty * cpu;
    } else {
      const amountSpent = parseFloat(fuelQty);
      if (!amountSpent) return;
      qty = parseFloat((amountSpent / cpu).toFixed(3));
      totalCost = amountSpent;
    }
    addEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fuelType,
      quantity: qty,
      costPerUnit: cpu,
      totalCost: totalCost,
      note: fuelNote.trim() || undefined,
    });
    setFuelQty('');
    setFuelCostPerUnit('');
    setFuelNote('');
    setBuyMode('by-litres');
    setShowModal(false);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Fuel & Power Log" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
          Fuel & Power Log
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 16 }}>
          Track diesel and electricity usage
        </Text>

        {loading ? (
          <View style={{ alignItems: 'center', paddingTop: 32 }}>
            <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
          </View>
        ) : entries.length === 0 ? (
          <EmptyStateCard
            icon={<MaterialIcons name="local-gas-station" size={48} color={Colors.outlineVariant} />}
            message="No fuel entries yet"
            style={{ marginBottom: 16 }}
          />
        ) : (
          <>
            {entries.map((entry) => (
              <FuelEntryCard
                key={entry.id}
                fuelType={entry.fuelType}
                date={entry.date}
                quantity={entry.quantity}
                costPerUnit={entry.costPerUnit}
                totalCost={entry.totalCost}
                note={entry.note}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating + button */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{ position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Fuel Entry Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Card style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderWidth: 0, borderColor: 'transparent' }}>
            <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Log Fuel Cost</Text>

            {/* Fuel Type Chips */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Fuel Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              {(['diesel', 'electricity'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFuelType(type)}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 1.5,
                    backgroundColor: fuelType === type ? Colors.primaryFixed : Colors.surfaceContainerHigh,
                    borderColor: fuelType === type ? Colors.primary : Colors.outlineVariant,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: fuelType === type ? Colors.primary : Colors.onSurfaceVariant,
                      fontWeight: fuelType === type ? '700' : '400',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Buy Mode */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
              How did you buy?
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setBuyMode('by-litres')}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1.5,
                  backgroundColor: buyMode === 'by-litres' ? Colors.primaryFixed : Colors.surfaceContainerHigh,
                  borderColor: buyMode === 'by-litres' ? Colors.primary : Colors.outlineVariant,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: buyMode === 'by-litres' ? Colors.primary : Colors.onSurfaceVariant,
                    fontWeight: buyMode === 'by-litres' ? '700' : '400',
                    textTransform: 'capitalize',
                  }}
                >
                  {fuelType === 'diesel' ? 'By Litres' : 'By kWh'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBuyMode('by-amount')}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1.5,
                  backgroundColor: buyMode === 'by-amount' ? Colors.primaryFixed : Colors.surfaceContainerHigh,
                  borderColor: buyMode === 'by-amount' ? Colors.primary : Colors.outlineVariant,
                }}
              >
                <Text
                  style={{
                    color: buyMode === 'by-amount' ? Colors.primary : Colors.onSurfaceVariant,
                    fontWeight: buyMode === 'by-amount' ? '700' : '400',
                    textTransform: 'capitalize',
                  }}
                >
                  By amount
                </Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                Quantity
              </Text>
              <TextInput
                placeholder={buyMode === 'by-litres' ? 'Litres' : 'Amount spent (KES)'}
                value={fuelQty}
                onChangeText={setFuelQty}
                keyboardType="numeric"
                style={{
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  marginBottom: 12,
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
                KES per {fuelType === 'diesel' ? 'litre' : 'kWh'}
              </Text>
              <TextInput
                value={fuelCostPerUnit}
                onChangeText={setFuelCostPerUnit}
                keyboardType="numeric"
                placeholder="e.g. 180"
                placeholderTextColor="#9ca3af"
                style={{
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  marginBottom: 12,
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Note (optional)</Text>
              <TextInput
                value={fuelNote}
                onChangeText={setFuelNote}
                placeholder="e.g. Weekly refill"
                placeholderTextColor="#9ca3af"
                style={{
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  marginBottom: 12,
                }}
              />
            </View>

            {/* Live Preview */}
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 15, marginBottom: 16 }}>
              {buyMode === 'by-litres' ? (
                <>{'Total cost: KES ' + (parseFloat(fuelQty || '0') * parseFloat(fuelCostPerUnit || '0')).toLocaleString()}</>
              ) : (
                <>{'= ' + (parseFloat(fuelQty || '0') / parseFloat(fuelCostPerUnit || '1')).toFixed(3) + ' litres'}</>
              )}
            </Text>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleAddFuelEntry}
              style={{ backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save Entry</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity onPress={() => {
              setBuyMode('by-litres');
              setShowModal(false);
            }} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}