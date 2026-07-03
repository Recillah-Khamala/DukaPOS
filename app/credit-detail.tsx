import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreditLedger } from '../hooks/useCreditLedger';
import { TopAppBar } from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const CreditDetailScreen: React.FC = () => {
  const { customerId, customerName } = useLocalSearchParams<{ customerId: string; customerName: string }>();
  const { entries } = useCreditLedger();
  const router = useRouter();

  const customerEntries = entries.filter(e => e.customerId === customerId && e.status === 'active');
  const totalBalance = customerEntries.reduce((sum, e) => sum + e.balance, 0);

  console.log('Customer entries:', customerEntries);

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar 
        title={`Detail: ${customerName}`} 
        onBack={() => router.back()} 
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text>Customer detail coming soon</Text>
      </ScrollView>
    </View>
  );
};

export default CreditDetailScreen;