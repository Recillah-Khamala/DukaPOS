import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreditLedger } from '../hooks/useCreditLedger';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const CreditDetailScreen: React.FC = () => {
  const { customerId, customerName } = useLocalSearchParams<{ customerId: string; customerName: string }>();
  const { entries, updateEntry } = useCreditLedger();
  const router = useRouter();

  const customerEntries = entries.filter(e => e.customerId === customerId && e.status === 'active');
  const totalBalance = customerEntries.reduce((sum, e) => sum + e.balance, 0);

  const handleMarkAsPaid = () => {
    customerEntries.forEach(entry => {
      updateEntry({
        ...entry,
        status: 'paid',
        amountPaid: entry.totalAmount,
        balance: 0,
        lastUpdatedAt: new Date().toISOString(),
      });
    });
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar 
        title={`Detail: ${customerName}`} 
        onBack={() => router.back()} 
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View>
            <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700' }}>
              {customerName}
            </Text>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14 }}>
              Purchase history for credit ledger
            </Text>
          </View>
          <TouchableOpacity 
            style={{ 
              backgroundColor: Colors.secondaryContainer, 
              borderRadius: 8, 
              paddingHorizontal: 16, 
              paddingVertical: 8, 
              flexDirection: 'row', 
              alignItems: 'center', 
              gap: 6 
            }}
            onPress={handleMarkAsPaid}
          >
            <MaterialIcons name="check-circle" size={16} color={Colors.onSecondaryContainer} />
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '700' }}>
              Mark as Paid
            </Text>
          </TouchableOpacity>
        </View>

        {/* Entries list */}
        {customerEntries.map((entry, index) => (
          <View key={index} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 8 }}>
            {/* Date header */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 }}>
              {new Date(entry.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>

            {/* Items */}
            {entry.items.map((item, itemIdx) => (
              <React.Fragment key={itemIdx}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: Colors.onSurface, fontSize: 15 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: Colors.onSurface, fontSize: 15, fontWeight: '600' }}>
                    KES {item.total.toLocaleString()}
                  </Text>
                </View>
                {itemIdx < entry.items.length - 1 && (
                  <View style={{ height: 1, backgroundColor: Colors.outlineVariant }} />
                )}
              </React.Fragment>
            ))}

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700' }}>
                KES {entry.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}

        {/* Total balance card */}
        <View style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: Colors.onPrimary, fontSize: 16, fontWeight: '600' }}>
            Total Balance
          </Text>
          <Text style={{ color: Colors.onPrimary, fontSize: 24, fontWeight: '800' }}>
            KES {totalBalance.toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreditDetailScreen;