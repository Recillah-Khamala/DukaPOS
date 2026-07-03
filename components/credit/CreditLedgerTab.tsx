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

  // Group by customerId
  const customerMap: Record<string, { name: string; balance: number; lastUpdated: string }> = {};
  activeEntries.forEach(e => {
    if (!customerMap[e.customerId]) {
      customerMap[e.customerId] = { name: e.customerName, balance: 0, lastUpdated: e.lastUpdatedAt };
    }
    customerMap[e.customerId].balance += e.balance;
    if (e.lastUpdatedAt > customerMap[e.customerId].lastUpdated) {
      customerMap[e.customerId].lastUpdated = e.lastUpdatedAt;
    }
  });
  const customers = Object.entries(customerMap);

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
        {customers.length === 0 ? (
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
        ) : (
          <>
            {customers.map(([customerId, data]) => {
              const isHighDebt = data.balance > 1000;
              const formattedDate = new Date(data.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              return (
                <View key={customerId} style={{
                  backgroundColor: isHighDebt ? '#fef2f2' : 'white',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isHighDebt ? Colors.error : Colors.outlineVariant,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: isHighDebt ? Colors.error : Colors.primaryFixed,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    <MaterialIcons name="person" size={24} color={isHighDebt ? 'white' : Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>
                      {data.name}
                    </Text>
                    <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                      Last update: {formattedDate}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ 
                      color: isHighDebt ? Colors.error : Colors.onSurface, 
                      fontSize: 20, 
                      fontWeight: '800' 
                    }}>
                      KES {data.balance.toLocaleString()}
                    </Text>
                    <Text style={{ 
                      color: isHighDebt ? Colors.error : Colors.onSurface, 
                      fontSize: 11, 
                      fontWeight: '700', 
                      textTransform: 'uppercase'
                    }}>
                      {isHighDebt ? 'High Debt' : 'Standard'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default CreditLedgerTab;