import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { useCustomers } from '../context/CustomersContext';
import { useCreditLedger } from '../hooks/useCreditLedger';
import { buildCreditItems, buildCreditEntry } from '../utils/creditEntryHelpers';
import type { Customer } from '../types';
import type { CreditItem } from '../hooks/useCreditLedger';
import CustomerPicker from '../components/credit/CustomerPicker';

export default function NewCreditEntryScreen() {
  const { addCustomer } = useCustomers();
  const { addEntry } = useCreditLedger();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [items, setItems] = useState<Array<{ name: string; quantity: number; unitPrice: number }>>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [deposit, setDeposit] = useState('');

  const handleCreateNewCustomer = async () => {
    if (!newCustomerName.trim()) {
      alert('Please enter a customer name');
      return;
    }
    try {
      const newCustomer = await addCustomer({ name: newCustomerName.trim() });
      setCustomer(newCustomer);
      setIsCreatingNew(false);
      setNewCustomerName('');
    } catch (e) {
      console.error('Failed to create customer:', e);
      alert('Failed to create customer');
    }
  };

  const handleSelectExistingCustomer = (selected: Customer) => {
    setCustomer(selected);
    setIsCreatingNew(false);
  };

  const addItem = () => {
    const name = newItemName.trim();
    const quantity = parseFloat(newItemQuantity);
    const price = parseFloat(newItemPrice);
    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
      alert('Please enter valid item details');
      return;
    }
    setItems(prev => [
      ...prev,
      { name, quantity, unitPrice: price },
    ]);
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemPrice('');
  };

  const handleSubmit = async () => {
    if (!customer) {
      alert('Please select a customer');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    const depositAmount = parseFloat(deposit) || 0;

    // Convert items to the format expected by buildCreditItems
    const draftItems = items.map(item => ({
      key: Math.random().toString(36).substr(2, 9),
      name: item.name,
      qty: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      category: 'other' as const, // default category, can be improved
      productId: undefined,
    }));

    // Build credit items (without existing debt)
    const creditItems = buildCreditItems(false, draftItems, {
      description: '',
      category: 'other',
      total: 0,
    }, []); // we don't have inventory items here, but we can pass an empty array and it will skip productId checks

    const totalAmount = creditItems.reduce((sum, item) => sum + item.total, 0);
    const depositAmountNum = Math.max(0, Math.min(depositAmount, totalAmount));

    const creditEntry = buildCreditEntry(
      customer.id,
      customer.name,
      creditItems,
      totalAmount,
      depositAmountNum,
      new Date().toISOString()
    );

    try {
      await addEntry(creditEntry);
      alert('Credit entry created successfully');
      // Reset form
      setCustomer(null);
      setItems([]);
      setDeposit('');
    } catch (e) {
      console.error('Failed to create credit entry:', e);
      alert('Failed to create credit entry');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: Colors.surface }}>
      <Text style={{ color: Colors.onSurface, fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>
        New Credit Entry
      </Text>

      {/* Customer Picker */}
      <CustomerPicker
        customer={customer}
        onCustomerSelected={handleSelectExistingCustomer}
        onChangeCustomer={() => setCustomer(null)}
      />

      {/* Item Input */}
      {customer && (
        <>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>
            Add Items
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <TextInput
              placeholder="Item name"
              value={newItemName}
              onChangeText={setNewItemName}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.outlineVariant,
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 10,
                color: Colors.onSurface,
              }}
            />
            <TextInput
              placeholder="Qty"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="decimal-pad"
              style={{
                width: 80,
                borderWidth: 1,
                borderColor: Colors.outlineVariant,
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 10,
                color: Colors.onSurface,
              }}
            />
            <TextInput
              placeholder="Price"
              value={newItemPrice}
              onChangeText={setNewItemPrice}
              keyboardType="decimal-pad"
              style={{
                width: 80,
                borderWidth: 1,
                borderColor: Colors.outlineVariant,
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 10,
                color: Colors.onSurface,
              }}
            />
            <TouchableOpacity
              onPress={addItem}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 6,
                paddingVertical: 10,
                paddingHorizontal: 16,
              }}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 4 }}>
            Items ({items.length}):
          </Text>
          {items.length === 0 ? (
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14 }}>No items added</Text>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <View style={{ padding: 12, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: 6, marginBottom: 8 }}>
                  <Text style={{ color: Colors.onSurface, fontSize: 15 }}>
                    {item.name} - {item.quantity} × KES {item.unitPrice.toFixed(2)} = KES {(item.quantity * item.unitPrice).toFixed(2)}
                  </Text>
                </View>
              })
              contentContainerStyle={{ paddingHorizontal: 4 }}
            />
          )}

          {/* Deposit Input */}
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8 }}>
            Deposit (optional)
          </Text>
          <TextInput
            placeholder="Amount paid now"
            value={deposit}
            onChangeText={setDeposit}
            keyboardType="decimal-pad"
            style={{
              borderWidth: 1,
              borderColor: Colors.outlineVariant,
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 12,
              color: Colors.onSurface,
              marginBottom: 8,
            }}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 24,
            }}
            disabled={!customer || items.length === 0}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Create Credit Entry
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}