import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useCustomers } from '../../context/CustomersContext';
import type { Customer } from '../../types';

interface CustomerPickerProps {
  customer: Customer | null;
  onCustomerSelected: (customer: Customer) => void;
  onChangeCustomer: () => void;
}

// Always asks explicitly whether this is a new or existing customer —
// no silent name-matching/slugging — per project convention. Used by both
// the standalone New Credit Entry screen and Checkout's "Sell on Credit"
// flow, so both paths create/attach customers through CustomersContext
// (real UUIDs) rather than each hand-rolling their own identity logic.
const CustomerPicker: React.FC<CustomerPickerProps> = ({ customer, onCustomerSelected, onChangeCustomer }) => {
  const { customers, loading, addCustomer } = useCustomers();
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [newCustomerName, setNewCustomerName] = React.useState('');

  const handleCreateNewCustomer = async () => {
    if (!newCustomerName.trim()) {
      alert('Please enter a customer name');
      return;
    }
    try {
      const newCustomer = await addCustomer({ name: newCustomerName.trim() });
      onCustomerSelected(newCustomer);
      setIsCreatingNew(false);
      setNewCustomerName('');
    } catch (e) {
      console.error('Failed to create customer:', e);
      alert('Failed to create customer');
    }
  };

  const handleSelectExistingCustomer = (selected: Customer) => {
    onCustomerSelected(selected);
    setIsCreatingNew(false);
  };

if (customer != null) {
     return (
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
         <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>
           Customer: {customer.name}
         </Text>
         <TouchableOpacity onPress={onChangeCustomer} style={{ padding: 8 }}>
           <MaterialIcons name="edit" size={20} color={Colors.primary} />
         </TouchableOpacity>
       </View>
     );
   }

  return (
    <>
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
        Is this a new customer or an existing one?
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setIsCreatingNew(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surfaceContainerHigh,
            borderRadius: 10,
            padding: 12,
            flex: 1,
            marginRight: 4,
          }}
        >
          <MaterialIcons name="person-add" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
            New Customer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsCreatingNew(false)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surfaceContainerHigh,
            borderRadius: 10,
            padding: 12,
            flex: 1,
            marginLeft: 4,
          }}
        >
          <MaterialIcons name="person" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
            Existing Customer
          </Text>
        </TouchableOpacity>
      </View>

      {isCreatingNew ? (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
            Enter New Customer Name
          </Text>
          <TextInput
            placeholder="e.g. Mama Njeri"
            value={newCustomerName}
            onChangeText={setNewCustomerName}
            style={{
              borderWidth: 1.5,
              borderColor: Colors.outlineVariant,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: Colors.onSurface,
              marginBottom: 8,
            }}
          />
          <TouchableOpacity
            onPress={handleCreateNewCustomer}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Create Customer
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
            Select Existing Customer
          </Text>
          {loading ? (
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13 }}>Loading customers...</Text>
          ) : customers.length === 0 ? (
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13 }}>No customers found</Text>
          ) : (
            <FlatList
              data={customers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectExistingCustomer(item)}
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: Colors.outlineVariant,
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: Colors.onSurface, fontSize: 15 }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />
          )}
        </View>
      )}
    </>
  );
};

export default CustomerPicker;