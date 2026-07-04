import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger, CreditItemCategory } from '../hooks/useCreditLedger';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type DraftItem = {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
};

const CATEGORY_OPTIONS: { label: string; value: CreditItemCategory }[] = [
  { label: 'Cereal', value: 'cereal' },
  { label: 'Milling', value: 'milling' },
  { label: 'Bags', value: 'bags' },
  { label: 'Other', value: 'other' },
];

const makeEmptyItem = (): DraftItem => ({
  key: Math.random().toString(36).substr(2, 9),
  name: '',
  qty: '',
  unitPrice: '',
  category: 'other',
});

const NewCreditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { addEntry } = useCreditLedger();

  const [customerName, setCustomerName] = React.useState('');
  const [items, setItems] = React.useState<DraftItem[]>([makeEmptyItem()]);

  const updateItem = (key: string, patch: Partial<DraftItem>) => {
    setItems(prev => prev.map(item => (item.key === key ? { ...item, ...patch } : item)));
  };

  const addItemRow = () => setItems(prev => [...prev, makeEmptyItem()]);

  const removeItemRow = (key: string) => {
    setItems(prev => (prev.length > 1 ? prev.filter(item => item.key !== key) : prev));
  };

  const itemTotal = (item: DraftItem) =>
    (parseFloat(item.qty || '0') || 0) * (parseFloat(item.unitPrice || '0') || 0);

  const grandTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);

  const isFormValid =
    customerName.trim() !== '' &&
    items.every(
      item =>
        item.name.trim() !== '' &&
        parseFloat(item.qty || '0') > 0 &&
        parseFloat(item.unitPrice || '0') > 0
    );

  const handleSave = async () => {
    if (!isFormValid) return;

    const builtItems = items.map(item => {
      const total = itemTotal(item);
      return {
        name: item.name.trim(),
        qty: parseFloat(item.qty),
        unitPrice: parseFloat(item.unitPrice),
        total,
        category: item.category,
        amountPaid: 0,
        balance: total,
      };
    });

    const total = builtItems.reduce((sum, i) => sum + i.total, 0);

    const newEntry: any = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: customerName.trim().toLowerCase().replace(/\s+/g, '-'),
      customerName: customerName.trim(),
      items: builtItems,
      totalAmount: total,
      amountPaid: 0,
      balance: total,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      status: 'active',
    };
    await addEntry(newEntry);
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <TopAppBar title="New Credit Entry" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Heading */}
        <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
          New Credit Sale
        </Text>
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
            marginBottom: 20,
          }}
        />

        {/* Item rows */}
        {items.map((item, index) => (
          <View
            key={item.key}
            style={{
              borderWidth: 1.5,
              borderColor: Colors.outlineVariant,
              borderRadius: 12,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 13, fontWeight: '700' }}>
                Item {index + 1}
              </Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => removeItemRow(item.key)}>
                  <MaterialIcons name="close" size={18} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category picker */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Category
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {CATEGORY_OPTIONS.map(opt => {
                const selected = item.category === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => updateItem(item.key, { category: opt.value })}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selected ? Colors.primary : Colors.secondaryContainer,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? '#fff' : Colors.onSecondaryContainer,
                        fontSize: 13,
                        fontWeight: selected ? '700' : '500',
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Item Name */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Item Name
            </Text>
            <TextInput
              placeholder="e.g. Maize"
              value={item.name}
              onChangeText={text => updateItem(item.key, { name: text })}
              style={{
                borderWidth: 1.5,
                borderColor: Colors.outlineVariant,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                color: Colors.onSurface,
                marginBottom: 14,
              }}
            />

            {/* Qty + Unit Price side by side */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
                  Quantity
                </Text>
                <TextInput
                  placeholder="e.g. 2"
                  keyboardType="numeric"
                  value={item.qty}
                  onChangeText={text => updateItem(item.key, { qty: text })}
                  style={{
                    borderWidth: 1.5,
                    borderColor: Colors.outlineVariant,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: Colors.onSurface,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
                  Unit Price (KES)
                </Text>
                <TextInput
                  placeholder="e.g. 130"
                  keyboardType="numeric"
                  value={item.unitPrice}
                  onChangeText={text => updateItem(item.key, { unitPrice: text })}
                  style={{
                    borderWidth: 1.5,
                    borderColor: Colors.outlineVariant,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: Colors.onSurface,
                  }}
                />
              </View>
            </View>

            {/* Line total */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
              Line total: KES {itemTotal(item).toLocaleString()}
            </Text>
          </View>
        ))}

        {/* Add another item */}
        <TouchableOpacity
          onPress={addItemRow}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: Colors.primary,
            borderStyle: 'dashed',
            marginBottom: 20,
          }}
        >
          <MaterialIcons name="add" size={18} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>
            Add Another Item
          </Text>
        </TouchableOpacity>

        {/* Live grand total preview */}
        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 24 }}>
          Total: KES {grandTotal.toLocaleString()}
        </Text>

        {/* Save button */}
        <TouchableOpacity
          style={{
            backgroundColor: isFormValid ? Colors.primary : Colors.surfaceContainerHigh,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 12,
          }}
          onPress={isFormValid ? handleSave : undefined}
        >
          <Text style={{ color: isFormValid ? '#fff' : Colors.onSurfaceVariant, fontSize: 16, fontWeight: '600' }}>
            Save Credit Entry
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewCreditEntryScreen;