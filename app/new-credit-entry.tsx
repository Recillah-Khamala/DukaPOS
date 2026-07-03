import React from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger } from '../hooks/useCreditLedger';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const NewCreditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { addEntry } = useCreditLedger(); // we might not use it yet but import as per instruction

  const [customerName, setCustomerName] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [unitPrice, setUnitPrice] = React.useState('');

  console.log('State:', { customerName, itemName, qty, unitPrice });

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar 
        title="New Credit Entry" 
        onBack={() => router.back()} 
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text>Form coming soon</Text>
      </ScrollView>
    </View>
  );
};

export default NewCreditEntryScreen;