// app/new-credit-entry.tsx
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger, CreditItemCategory, allocatePaymentToItems } from '../hooks/useCreditLedger';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { categoryToBasketType, parseManualDate } from '../utils/creditEntryHelpers';
import ItemEntryCard from '../components/credit/ItemEntryCard';
import LegacyDebtForm from '../components/credit/LegacyDebtForm';

type DraftItem = {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
};

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
          total: total,
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
          <LegacyDebtForm
            description={debtDescription}
            onDescriptionChange={setDebtDescription}
            category={debtCategory}
            onCategoryChange={setDebtCategory}
            total={debtTotal}
            onTotalChange={setDebtTotal}
            alreadyPaid=debtAlreadyPaid
            onAlreadyPaidChange={setDebtAlreadyPaid}
            day={debtDay}
            onDayChange={setDebtDay}
            month={debtMonth}
            onMonthChange={setDebtMonth}
            year={debtYear}
            onYearChange={setDebtYear}
          />
        ) : (
          <>
            {/* Item rows */}
            {items.map((item, index) => (
              <ItemEntryCard
                key={item.key}
                item={item}
                index={index}
                onUpdate={updateItem}
                onRemove={removeItemRow}
                canRemove={items.length > 1}
              />
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