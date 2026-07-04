// app/credit-detail.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreditLedger } from '../hooks/useCreditLedger';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const CreditDetailScreen: React.FC = () => {
  const { customerId, customerName } = useLocalSearchParams<{ customerId: string; customerName: string }>();
  const { entries, recordPayment } = useCreditLedger();
  const router = useRouter();
  const [paymentAmount, setPaymentAmount] = useState('');

  const customerEntries = entries.filter(e => e.customerId === customerId && e.status === 'active');
  const totalBalance = customerEntries.reduce((sum, e) => sum + e.balance, 0);

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid payment amount.');
      return;
    }
    if (amount > totalBalance) {
      Alert.alert(
        'Amount exceeds balance',
        `This customer only owes KES ${totalBalance.toLocaleString()}. Record the full amount anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Record',
            onPress: async () => {
              await recordPayment(customerId as string, totalBalance);
              setPaymentAmount('');
            },
          },
        ]
      );
      return;
    }
    recordPayment(customerId as string, amount);
    setPaymentAmount('');
  };

  const handlePayFullBalance = () => {
    if (totalBalance <= 0) return;
    recordPayment(customerId as string, totalBalance);
    setPaymentAmount('');
  };

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar
        title={`Detail: ${customerName}`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header row */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700' }}>
            {customerName}
          </Text>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14 }}>
            Purchase history for credit ledger
          </Text>
        </View>

        {/* Entries list */}
        {customerEntries.map((entry, index) => (
          <View key={index} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 8 }}>
            {/* Date header */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8 }}>
              {new Date(entry.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>

            {/* Items */}
            {entry.items.map((item, itemIdx) => {
              const itemBalance = item.balance ?? item.total;
              const isPartlyPaid = itemBalance < item.total && itemBalance > 0;
              return (
                <React.Fragment key={itemIdx}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: Colors.onSurface, fontSize: 15 }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: Colors.onSurface, fontSize: 15, fontWeight: '600' }}>
                      KES {itemBalance.toLocaleString()}
                      {isPartlyPaid ? ` of ${item.total.toLocaleString()}` : ''}
                    </Text>
                  </View>
                  {itemIdx < entry.items.length - 1 && (
                    <View style={{ height: 1, backgroundColor: Colors.outlineVariant }} />
                  )}
                </React.Fragment>
              );
            })}

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700' }}>
                KES {entry.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        ))}

        {/* Total balance card */}
        <View style={{ backgroundColor: Colors.primary, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
          <Text style={{ color: Colors.onPrimary, fontSize: 16, fontWeight: '600' }}>
            Total Balance
          </Text>
          <Text style={{ color: Colors.onPrimary, fontSize: 24, fontWeight: '800' }}>
            KES {totalBalance.toLocaleString()}
          </Text>
        </View>

        {/* Record payment */}
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant }}>
          <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Record Payment
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              placeholder="Amount received"
              keyboardType="decimal-pad"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.outline,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
            <TouchableOpacity
              onPress={handleRecordPayment}
              style={{ backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}
            >
              <Text style={{ color: Colors.onPrimary, fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handlePayFullBalance}
            disabled={totalBalance <= 0}
            style={{
              marginTop: 10,
              backgroundColor: Colors.secondaryContainer,
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <MaterialIcons name="check-circle" size={16} color={Colors.onSecondaryContainer} />
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '700' }}>
              Pay Full Balance (KES {totalBalance.toLocaleString()})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreditDetailScreen;