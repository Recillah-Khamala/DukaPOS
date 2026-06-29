import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFuelLog } from '../../hooks/useFuelLog';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import Colors from '../../constants/colors';

const PoshomillTab: React.FC = () => {
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
    </View>
  );
};

export default PoshomillTab;