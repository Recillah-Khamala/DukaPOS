import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger } from '../hooks/useCreditLedger';
import { TopAppBar } from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

const NewCreditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { addEntry } = useCreditLedger();

  const [customerName, setCustomerName] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [unitPrice, setUnitPrice] = React.useState('');

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar 
        title="New Credit Entry" 
        onBack={() => router.back()} 
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Heading */}
        <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
          New Credit Sale
        </Text>
        {/* Subheading */}
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 24 }}>
          Record a sale on credit for a customer
        </Text>

        {/* Customer Name field */}
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          Customer Name
        </Text>
        <TextInput
          placeholder="e.g. Mama Njeri"
          value={customerName}
          onChangeText={setCustomerName}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            marginBottom: 16,
          }}
        />

        {/* Item Name field */}
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          Item Name
        </Text>
        <TextInput
          placeholder="e.g. Maize"
          value={itemName}
          onChangeText={setItemName}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            marginBottom: 16,
          }}
        />

        {/* Quantity field */}
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          Quantity
        </Text>
        <TextInput
          placeholder="e.g. 2"
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            marginBottom: 16,
          }}
        />

        {/* Unit Price field */}
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          Unit Price (KES)
        </Text>
        <TextInput
          placeholder="e.g. 130"
          keyboardType"
          keyboardType="numeric"
          value={unitPrice}
          onChangeText={setUnitPrice}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            marginBottom: 16,
          }}
        />

        {/* Live total preview */}
        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 24 }}>
          Total: KES {(parseFloat(qty || '0') * parseFloat(unitPrice || '0')).toLocaleString()}
        </Text>

        {/* Submit button placeholder for now */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 24,
            paddingVertical: 12,
            alignItems: 'center',
          }}
          onPress={() => {
            // TODO: implement form submission
          }}
        >
          <Text style={{ color: Colors.onPrimary, fontSize: 16, fontWeight: '600' }}>
            Save Credit Entry
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewCreditEntryScreen;