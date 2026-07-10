import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFuelLog } from '../../hooks/useFuelLog';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import Colors from '../../constants/colors';
import Card from '../../components/ui/Card';

const PoshomillTab: React.FC = () => {
  const { sales } = useSalesHistory();
  const { entries: fuelEntries } = useFuelLog();
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
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
        Mill Profitability
      </Text>
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 16 }}>
        Last 30 days milling revenue vs fuel costs
      </Text>

      {/* Profitability summary card */}
      <Card style={{ marginBottom: 16 }} backgroundColor={isProfit ? Colors.primaryContainer : '#fef2f2'}>
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
    </ScrollView>
  );
};

export default PoshomillTab;