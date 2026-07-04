// app/new-credit-entry.tsx
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger, CreditItemCategory, allocatePaymentToItems } from '../hooks/useCreditLedger';
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

// Parses a DD/MM/YYYY string into an ISO date string.
// Falls back to "now" if the input is missing or malformed, rather than
// blocking save — an approximate old date is still better than none.
const parseManualDate = (day: string, month: string, year: string): string => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y || y < 2000 || m < 1 || m > 12 || d < 1 || d > 31) {
    return new Date().toISOString();
  }
  const parsed = new Date(y, m - 1, d);
  if (isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
};

const NewCreditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { addEntry } = useCreditLedger();

  const [customerName, setCustomerName] = React.useState('');
  const [items, setItems] = React.useState<DraftItem[]>([makeEmptyItem()]);
  const [amountReceivedNow, setAmountReceivedNow] = React.useState('');

  // --- Existing debt (pre-DukaPOS) mode ---
  const [isExistingDebt, setIsExistingDebt] = React.useState(false);
  const [debtDescription, setDebtDescription] = React.useState('');
  const [debtCategory, setDebtCategory] = React.useState<CreditItemCategory>('other');
  const [debtTotal, setDebtTotal] = React.useState('');
  const [debtAlreadyPaid, setDebtAlreadyPaid] = React.useState('');
  const [debtDay, setDebtDay] = React.useState('');
  const [debtMonth, setDebtMonth] = React.useState('');
  const [debtYear, setDebtYear] = React.useState('');

  const updateItem = (key: string, patch: Partial<DraftItem>) => {
    setItems(prev => prev.map(item => (item.key === key ? { ...item, ...patch } : item)));
  };

  const addItemRow = () => setItems(prev => [...prev, makeEmptyItem()]);

  const removeItemRow = (key: string) => {
    setItems(prev => (prev.length > 1 ? prev.filter(item => item.key !== key) : prev));
  };

  const itemTotal = (item: DraftItem) =>
    (parseFloat(item.qty || '0') || 0) * (parseFloat(item.unitPrice || '0') || 0);

  const grandTotal = isExistingDebt
    ? Math.max(0, parseFloat(debtTotal || '0') || 0)
    : items.reduce((sum, item) => sum + itemTotal(item), 0);

  // Clamp deposit/already-paid to [0, grandTotal]
  const depositRaw = isExistingDebt
    ? parseFloat(debtAlreadyPaid || '0') || 0
    : parseFloat(amountReceivedNow || '0') || 0;
  const deposit = Math.max(0, Math.min(depositRaw, grandTotal));
  const remainingAfterDeposit = Math.max(0, grandTotal - deposit);

  const isFormValid = isExistingDebt
    ? customerName.trim() !== '' && parseFloat(debtTotal || '0') > 0
    : customerName.trim() !== '' &&
      items.every(
        item =>
          item.name.trim() !== '' &&
          parseFloat(item.qty || '0') > 0 &&
          parseFloat(item.unitPrice || '0') > 0
      );

  const handleSave = async () => {
    if (!isFormValid) return;

    let builtItems;
    let total;
    let createdAt = new Date().toISOString();

    if (isExistingDebt) {
      total = grandTotal;
      builtItems = [
        {
          name: debtDescription.trim() || 'Opening Balance (before app)',
          qty: 1,
          unitPrice: total,
          total,
          category: debtCategory,
          amountPaid: 0,
          balance: total,
        },
      ];
      createdAt = parseManualDate(debtDay, debtMonth, debtYear);
    } else {
      builtItems = items.map(item => {
        const t = itemTotal(item);
        return {
          name: item.name.trim(),
          qty: parseFloat(item.qty),
          unitPrice: parseFloat(item.unitPrice),
          total: t,
          category: item.category,
          amountPaid: 0,
          balance: t,
        };
      });
      total = builtItems.reduce((sum, i) => sum + i.total, 0);
    }

    // Apply any prior payment (deposit at sale time, or already-paid portion
    // of an old debt) using the same proportional-split logic as a later repayment.
    if (deposit > 0) {
      builtItems = allocatePaymentToItems(builtItems, deposit);
    }

    const balance = Math.max(0, total - deposit);

    const newEntry: any = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: customerName.trim().toLowerCase().replace(/\s+/g, '-'),
      customerName: customerName.trim(),
      items: builtItems,
      totalAmount: total,
      amountPaid: deposit,
      balance,
      createdAt,
      lastUpdatedAt: new Date().toISOString(),
      status: balance <= 0.01 ? 'paid' : 'active',
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
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 20 }}>
          Record a sale on credit for a customer
        </Text>

        {/* Existing debt toggle */}
        <TouchableOpacity
          onPress={() => setIsExistingDebt(prev => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: isExistingDebt ? Colors.primaryContainer : Colors.surfaceContainerHigh,
            borderRadius: 10,
            padding: 12,
            marginBottom: 24,
          }}
        >
          <MaterialIcons
            name={isExistingDebt ? 'check-box' : 'check-box-outline-blank'}
            size={20}
            color={isExistingDebt ? Colors.onPrimaryContainer : Colors.onSurfaceVariant}
          />
          <Text
            style={{
              color: isExistingDebt ? Colors.onPrimaryContainer : Colors.onSurfaceVariant,
              fontSize: 13,
              fontWeight: '600',
              flex: 1,
            }}
          >
            This is an existing debt from before I started using DukaPOS
          </Text>
        </TouchableOpacity>

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

        {isExistingDebt ? (
          <>
            {/* Description */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Description (optional)
            </Text>
            <TextInput
              placeholder="e.g. Old balance from before the app"
              value={debtDescription}
              onChangeText={setDebtDescription}
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

            {/* Category */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Category (if known)
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {CATEGORY_OPTIONS.map(opt => {
                const selected = debtCategory === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setDebtCategory(opt.value)}
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

            {/* Total owed */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Total Amount Owed (KES)
            </Text>
            <TextInput
              placeholder="e.g. 400"
              keyboardType="numeric"
              value={debtTotal}
              onChangeText={setDebtTotal}
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

            {/* Already paid */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Amount Already Paid (optional)
            </Text>
            <TextInput
              placeholder="e.g. 0"
              keyboardType="numeric"
              value={debtAlreadyPaid}
              onChangeText={setDebtAlreadyPaid}
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

            {/* Debt origin date */}
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
              Debt Started On (approximate is fine)
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <TextInput
                placeholder="DD"
                keyboardType="numeric"
                maxLength={2}
                value={debtDay}
                onChangeText={setDebtDay}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  textAlign: 'center',
                }}
              />
              <TextInput
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
                value={debtMonth}
                onChangeText={setDebtMonth}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  textAlign: 'center',
                }}
              />
              <TextInput
                placeholder="YYYY"
                keyboardType="numeric"
                maxLength={4}
                value={debtYear}
                onChangeText={setDebtYear}
                style={{
                  flex: 1.5,
                  borderWidth: 1.5,
                  borderColor: Colors.outlineVariant,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: Colors.onSurface,
                  textAlign: 'center',
                }}
              />
            </View>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginBottom: 20 }}>
              Leave blank to use today's date. This affects which debts get paid off first when the customer makes a payment.
            </Text>
          </>
        ) : (
          <>
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
          </>
        )}

        {/* Live grand total preview */}
        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 20 }}>
          Total: KES {grandTotal.toLocaleString()}
        </Text>

        {/* Amount received now — only for non-legacy sales; legacy debt uses its own "Already Paid" field above */}
        {!isExistingDebt && (
          <View
            style={{
              backgroundColor: Colors.secondaryContainer,
              borderRadius: 12,
              padding: 14,
              marginBottom: 24,
            }}
          >
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '700', marginBottom: 6 }}>
              Amount Received Now (optional)
            </Text>
            <TextInput
              placeholder="e.g. 100"
              keyboardType="numeric"
              value={amountReceivedNow}
              onChangeText={setAmountReceivedNow}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                color: Colors.onSurface,
                marginBottom: 8,
              }}
            />
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13 }}>
              {deposit > 0
                ? `Paid now: KES ${deposit.toLocaleString()}  ·  Remaining on credit: KES ${remainingAfterDeposit.toLocaleString()}`
                : 'Leave blank if nothing is paid today'}
            </Text>
          </View>
        )}

        {isExistingDebt && deposit > 0 && (
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginBottom: 20 }}>
            Already paid: KES {deposit.toLocaleString()} · Remaining: KES {remainingAfterDeposit.toLocaleString()}
          </Text>
        )}

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
            {isExistingDebt ? 'Save Old Debt' : 'Save Credit Entry'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewCreditEntryScreen;