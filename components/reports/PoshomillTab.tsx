import React from 'react';
import { View, Text, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFuelLog } from '../../hooks/useFuelLog';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import Colors from '../../constants/colors';

const PoshomillTab: React.FC = () => {
  const [showFuelModal, setShowFuelModal] = React.useState(false);
  const [fuelType, setFuelType] = React.useState<'diesel' | 'electricity'>('diesel');
  const [fuelQty, setFuelQty] = React.useState('');
  const [fuelCostPerUnit, setFuelCostPerUnit] = React.useState('');
  const [fuelNote, setFuelNote] = React.useState('');

  const { sales } = useSalesHistory();
  const { entries: fuelEntries, loading: fuelLoading, addEntry } = useFuelLog();
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const millingRevenue = sales
    .filter(s => new Date(s.completedAt).getTime() >= thirtyDaysAgo)
    .flatMap(s => s.items)
    .filter(item => item.type === 'service')
    .reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const totalFuelCost = fuelEntries
    .filter(e => new Date(e.date).getTime() >= thirtyDaysAgo)
    .reduce((sum, e) => sum + e.totalCost, 0);
  const millingProfit = millingRevenue - totalFuelCost;
  const isProfit = millingProfit >= 0;

  const handleAddFuelEntry = () => {
    const qty = parseFloat(fuelQty);
    const cpu = parseFloat(fuelCostPerUnit);
    if (!qty || !cpu) return;
    addEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      fuelType,
      quantity: qty,
      costPerUnit: cpu,
      totalCost: qty * cpu,
      note: fuelNote.trim() || undefined,
    });
    setFuelQty('');
    setFuelCostPerUnit('');
    setFuelNote('');
    setShowFuelModal(false);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
          Poshomill Costs
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 16 }}>
          Track fuel costs vs milling revenue
        </Text>

        {/* Profitability summary card */}
        <View style={{
          backgroundColor: isProfit ? Colors.primaryContainer : '#fef2f2',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ color: isProfit ? Colors.onPrimaryContainer : Colors.error, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            Last 30 Days — Milling vs Fuel
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 14 }}>Milling Revenue</Text>
            <Text style={{ color: '#16a34a', fontSize: 14, fontWeight: '700' }}>KES {millingRevenue.toLocaleString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 14 }}>Fuel Costs</Text>
            <Text style={{ color: Colors.error, fontSize: 14, fontWeight: '700' }}>KES {totalFuelCost.toLocaleString()}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '700' }}>Net Profit</Text>
            <Text style={{ color: isProfit ? Colors.primary : Colors.error, fontSize: 16, fontWeight: '800' }}>
              KES {Math.abs(millingProfit).toLocaleString()}
            </Text>
          </View>
          <Text style={{ color: isProfit ? '#16a34a' : Colors.error, fontSize: 12, marginTop: 8 }}>
            {isProfit ? '✓ Milling is profitable' : '⚠ Fuel costs exceed milling revenue'}
          </Text>
        </View>

        {/* Fuel entries list */}
        {fuelLoading ? (
          <View style={{ alignItems: 'center', paddingTop: 32 }}>
            <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
          </View>
        ) : fuelEntries.length === 0 ? (
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: Colors.outlineVariant, alignItems: 'center' }}>
            <MaterialIcons name="local-gas-station" size={48} color={Colors.outlineVariant} />
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 8 }}>
              No fuel entries yet
            </Text>
          </View>
        ) : (
          <>
            {fuelEntries.map((entry) => (
              <View key={entry.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: entry.fuelType === 'diesel' ? Colors.secondaryContainer : Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <MaterialIcons name={entry.fuelType === 'diesel' ? 'local-gas-station' : 'bolt'} size={22} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }}>
                    {entry.fuelType === 'diesel' ? 'Diesel' : 'Electricity'}
                  </Text>
                  <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                    {new Date(entry.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                  <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                    {entry.quantity} {entry.fuelType === 'diesel' ? 'L' : 'kWh'} @ KES {entry.costPerUnit}/unit
                  </Text>
                  {entry.note && (
                    <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontStyle: 'italic', marginTop: 2 }}>{entry.note}</Text>
                  )}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: Colors.error, fontSize: 16, fontWeight: '700' }}>KES {entry.totalCost.toLocaleString()}</Text>
                  <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11 }}>fuel cost</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setShowFuelModal(true)}
        style={{ position: 'absolute', bottom: 16, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Fuel Entry Modal */}
      <Modal visible={showFuelModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Log Fuel Cost</Text>

            {/* Fuel Type Chips */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Fuel Type</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {(['diesel', 'electricity'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFuelType(type)}
                  style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: fuelType === type ? Colors.primaryFixed : '#f3f4f6', borderColor: fuelType === type ? Colors.primary : '#e5e7eb' }}
                >
                  <Text style={{ color: fuelType === type ? Colors.primary : Colors.onSurfaceVariant, fontWeight: fuelType === type ? '700' : '400', textTransform: 'capitalize' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Quantity ({fuelType === 'diesel' ? 'Litres' : 'kWh'})
            </Text>
            <TextInput
              value={fuelQty}
              onChangeText={setFuelQty}
              keyboardType="numeric"
              placeholder={fuelType === 'diesel' ? 'e.g. 5' : 'e.g. 12'}
              placeholderTextColor="#9ca3af"
              style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, marginBottom: 12 }}
            />

            {/* Cost Per Unit */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              KES per {fuelType === 'diesel' ? 'litre' : 'kWh'}
            </Text>
            <TextInput
              value={fuelCostPerUnit}
              onChangeText={setFuelCostPerUnit}
              keyboardType="numeric"
              placeholder="e.g. 180"
              placeholderTextColor="#9ca3af"
              style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, marginBottom: 12 }}
            />

            {/* Note */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Note (optional)</Text>
            <TextInput
              value={fuelNote}
              onChangeText={setFuelNote}
              placeholder="e.g. Weekly refill"
              placeholderTextColor="#9ca3af"
              style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, marginBottom: 12 }}
            />

            {/* Live Preview */}
            <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 15, marginBottom: 16 }}>
              Total cost: KES {(parseFloat(fuelQty || '0') * parseFloat(fuelCostPerUnit || '0')).toLocaleString()}
            </Text>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleAddFuelEntry}
              style={{ backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save Entry</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity onPress={() => setShowFuelModal(false)} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PoshomillTab;