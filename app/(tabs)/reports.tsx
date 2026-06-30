import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import { useFuelLog } from '../../hooks/useFuelLog';
import BusinessHealthTab from '../../components/reports/BusinessHealthTab';
import MarketInsightsTab from '../../components/reports/MarketInsightsTab';
import PoshomillTab from '../../components/reports/PoshomillTab';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = React.useState<'Business Health' | 'Market Insights' | 'Poshomill'>('Business Health');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);
  const { sales } = useSalesHistory();
  const { addEntry } = useFuelLog();
  const [showFuelModal, setShowFuelModal] = React.useState(false);
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
    setShowFuelModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: Colors.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <MaterialIcons name="assessment" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <MaterialIcons name="notifications-none" size={24} color="white" />
      </View>

      {/* Tab Row */}
      <View style={{ flexDirection: 'row', height: 44 }}>
        {(['Business Health', 'Market Insights', 'Poshomill'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[activeTab === tab ? { backgroundColor: Colors.secondaryContainer } : {}, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ color: activeTab === tab ? Colors.onSecondaryContainer : Colors.onSurfaceVariant, fontWeight: activeTab === tab ? '600' : '400', fontSize: 12 }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'Business Health' && <BusinessHealthTab sales={sales} />}
        {activeTab === 'Market Insights' && <MarketInsightsTab />}
        {activeTab === 'Poshomill' && <PoshomillTab />}
      </View>

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />

      {/* Floating Add Button (only for Poshomill tab) */}
      {activeTab === 'Poshomill' && (
        <TouchableOpacity
          onPress={() => setShowFuelModal(true)}
          style={{ position: 'absolute', bottom: bottomNavHeight + 16, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, zIndex: 20 }}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

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

            {/* Buy Mode */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
              How did you buy?
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => setBuyMode('by-litres')}
                style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: buyMode === 'by-litres' ? Colors.primaryFixed : '#f3f4f6', borderColor: buyMode === 'by-litres' ? Colors.primary : '#e5e7eb' }}
              >
                <Text style={{ color: buyMode === 'by-litres' ? Colors.primary : Colors.onSurfaceVariant, fontWeight: buyMode === 'by-litres' ? '700' : '400', textTransform: 'capitalize' }}>
                  By litres
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBuyMode('by-amount')}
                style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: buyMode === 'by-amount' ? Colors.primaryFixed : '#f3f4f6', borderColor: buyMode === 'by-amount' ? Colors.primary : '#e5e7eb' }}
              >
                <Text style={{ color: buyMode === 'by-amount' ? Colors.primary : Colors.onSurfaceVariant, fontWeight: buyMode === 'by-amount' ? '700' : '400', textTransform: 'capitalize' }}>
                  By amount spent
                </Text>
              </TouchableOpacity>
            </View>

            {buyMode === 'by-litres' ? (
  <>
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
  </>
) : (
  <>
    <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
      Amount Spent (KES)
    </Text>
    <TextInput
      value={fuelQty}
      onChangeText={setFuelQty}
      keyboardType="numeric"
      placeholder="e.g. 500"
      placeholderTextColor="#9ca3af"
      style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, marginBottom: 12 }}
    />
  </>
)}

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
              setShowFuelModal(false);
            }} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}