import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreditLedger } from '../../hooks/useCreditLedger';

const CreditLedgerTab: React.FC = () => {
  const { entries, loading } = useCreditLedger();

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
      </ScrollView>
    );
  }

  const activeEntries = entries.filter(e => e.status === 'active');
  const totalDebt = activeEntries.reduce((sum, e) => sum + e.balance, 0);
  const customerCount = new Set(activeEntries.map(e => e.customerId)).size;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      {/* Heading */}
      <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
        Shop Credit Health
      </Text>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {/* Total Debt card */}
        <View style={{ flex: 1, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant }}>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
            TOTAL DEBT
          </Text>
          <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '800' }}>
            KES {totalDebt.toLocaleString()}
          </Text>
        </View>
        {/* Customers card */}
        <View style={{ flex: 1, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant }}>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
            CUSTOMERS
          </Text>
          <Text style={{ color: Colors.secondary, fontSize: 24, fontWeight: '800' }}>
            {customerCount}
          </Text>
        </View>
      </View>

      {/* Active Debts */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ 
          color: Colors.onSurfaceVariant, 
          fontSize: 11, 
          fontWeight: '700', 
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 8
        }}>
          Active Debts
        </Text>
        {activeEntries.length === 0 ? (
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 24, 
            borderWidth: 1, 
            borderColor: Colors.outlineVariant, 
            alignItems: 'center' 
          }}>
            <MaterialIcons name="person-off" size={48} color={Colors.outlineVariant} />
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 8 }}>
              No active debts
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default CreditLedgerTab;