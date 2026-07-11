// app/new-credit-entry.tsx
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger, CreditItemCategory, allocatePaymentToItems } from '../hooks/useCreditLedger';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useInventory } from '../context/InventoryContext';
import type { BasketItem, CompletedSale } from '../types';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import {
  categoryToBasketType,
  parseManualDate,
  inventoryCategoryToCreditCategory,
  computeInventoryDeduction,
  makeCustomerId,
  buildCreditItems,
  DraftItem,
} from '../utils/creditEntryHelpers';
import ItemEntryCard from '../components/credit/ItemEntryCard';
import LegacyDebtForm from '../components/credit/LegacyDebtForm';
import WarningBanner from '../components/ui/WarningBanner';

const makeEmptyItem = (): DraftItem => ({
  key: Math.random().toString(36).substr(2, 9),
  name: '',
  qty: '',
  unitPrice: '',
  category: 'other',
  productId: undefined,
  unit: undefined,
});

const NewCreditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { addEntry, entries, recordPayment } = useCreditLedger();
  const { addSale } = useSalesHistory();

  const [customerName, setCustomerName] = React.useState('');
  const [items, setItems] = React.useState<DraftItem[]>([makeEmptyItem()]);
  const [amountReceivedNow, setAmountReceivedNow] = React.useState('');
  const [bannerMessage, setBannerMessage] = React.useState<string | null>(null);

  // Inventory for product lookup
  const { allItems, updateItem } = useInventory();

  // --- Existing debt (pre-DukaPOS) mode ---
  const [isExistingDebt, setIsExistingDebt] = React.useState(false);
  const [debtDescription, setDebtDescription] = React.useState('');
  const [debtCategory, setDebtCategory] = React.useState<CreditItemCategory>('other');
  const [debtTotal, setDebtTotal] = React.useState('');
  const [debtAlreadyPaid, setDebtAlreadyPaid] = React.useState('');
  const [debtDay, setDebtDay] = React.useState('');
  const [debtMonth, setDebtMonth] = React.useState('');
  const [debtYear, setDebtYear] = React.useState('');

  // Live prior-debt for the currently typed customer name (shown inline)
  const livePriorDebt = React.useMemo(() => {
    const id = makeCustomerId(customerName);
    return entries.filter(e => e.customerId === id && e.status === 'active').reduce((sum, e) => sum + e.balance, 0);
  }, [entries, customerName]);

  const updateDraftItem = (key: string, patch: Partial<DraftItem>) => {
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
   const excessPayment = Math.max(0, depositRaw - grandTotal);
   if (!isExistingDebt) {
     console.log('Excess payment:', excessPayment);
   }

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

    // Compute customerId for prior debt lookup and for the new entry
    const customerId = makeCustomerId(customerName);
    const priorDebt = entries.filter(e => e.customerId === customerId && e.status === 'active')
                             .reduce((sum, e) => sum + e.balance, 0);
    console.log('Prior debt:', priorDebt);

let builtItems = buildCreditItems(
    isExistingDebt,
    items,
    { description: debtDescription, category: debtCategory, total: grandTotal },
    allItems
  );
  const total = builtItems.reduce((sum, item) => sum + item.total, 0);
  let createdAt = new Date().toISOString();
  if (isExistingDebt) {
    createdAt = parseManualDate(debtDay, debtMonth, debtYear);
  }

    // Apply any prior payment (deposit at sale time, or already-paid portion
    // of an old debt) using the same proportional-split logic as a later repayment.
    if (deposit > 0) {
      builtItems = allocatePaymentToItems(builtItems, deposit);
    }

    // Legacy debt (pre-DukaPOS) does not affect inventory; skip deduction.
    const warnings: string[] = [];
    const inventoryUpdates: Array<{id: string; currentStock: number; isLowStock: boolean}> = [];
    if (!isExistingDebt) {
      // Log intended inventory deductions and update stock
      // Inventory deducted once at sale time — do not duplicate in repayment flow.
      builtItems.forEach(item => {
        if (item.productId) {
        const inventoryItem = allItems.find(it => it.id === item.productId);
            if (inventoryItem) {
                const deduction = computeInventoryDeduction(item, inventoryItem);
                const currentStock = inventoryItem.currentStock;
                let newStock: number;
                let isLowStock: boolean;
if (deduction > currentStock) {
                    newStock = 0;
                    isLowStock = true;
                    const warningMsg = `${inventoryItem.name} stock is now 0 — sale exceeded recorded stock`;
                    warnings.push(warningMsg);
                    console.warn(warningMsg);
                } else {
                    newStock = currentStock - deduction;
                    isLowStock = newStock <= inventoryItem.lowStockThreshold;
                    if (isLowStock) {
                        const warningMsg = `Low stock: ${inventoryItem.name} (${newStock} left)`;
                        warnings.push(warningMsg);
                        console.warn(warningMsg);

    }
                }
            inventoryUpdates.push({ id: inventoryItem.id, currentStock: newStock, isLowStock });
            console.log('would deduct', item.productId, deduction);
          } else {
            console.log('skipped - inventory item not found', item.productId);
          }
        } else {
          // unlinked (free-text) items never reach computeInventoryDeduction at all — their qty is only ever used for the line-total/ledger math, never for stock, so no unit ambiguity applies there.
          console.log('skipped - not linked', item.name);
        }
      });
    }

    const balance = Math.max(0, total - deposit);

    const newEntry: any = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: customerId,
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
    if (!isExistingDebt && excessPayment > 0) {
      await recordPayment(customerId, excessPayment);
      const appliedToDebt = Math.min(excessPayment, priorDebt);
      const stillOwing = Math.max(0, priorDebt - excessPayment);
      // Always surface the debt-applied banner
      warnings.push(
        `Sale paid in full. KES ${appliedToDebt.toLocaleString()} applied to previous debt. Remaining debt: KES ${stillOwing.toLocaleString()}.`
      );
      // If customer paid more than all debts, also show change-due reminder
      if (excessPayment > priorDebt) {
        const changeDue = excessPayment - priorDebt;
        warnings.push(
          `Customer overpaid by KES ${changeDue.toLocaleString()} beyond all debts — please give change.`
        );
      }
    }

    // Also record this as a completed sale so it feeds Reports/Business Health
    // the same way a cash sale does — revenue is recognized now, at the moment
    // of sale, regardless of how much (if any) has actually been collected yet.
    const saleItems: BasketItem[] = builtItems.map((item, idx) => ({
      id: `${newEntry.id}-${idx}`,
      productId: item.productId ?? `${newEntry.id}-${idx}`,
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
      type: categoryToBasketType(item.category as CreditItemCategory),
    }));

    const sale: CompletedSale = {
      id: newEntry.id,
      items: saleItems,
      total,
      paymentMethod: 'credit',
      completedAt: createdAt,
    };
await addSale(sale);
// Apply inventory updates after successful ledger and sale writes.
      inventoryUpdates.forEach(update => {
        updateItem(update.id, { currentStock: update.currentStock, isLowStock: update.isLowStock });
      });

     // Show banner if there are warnings, then go back after a delay
    if (warnings.length > 0) {
      setBannerMessage(warnings.join('\n'));
      // Show banner for 3 seconds then go back
      setTimeout(() => {
        router.back();
      }, 3000);
    } else {
      router.back();
    }
};

return (
  <View className="flex-1">
      <TopAppBar title="New Credit Entry" onBack={() => router.back()} />
      {bannerMessage && <WarningBanner message={bannerMessage} />}
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
            style={{ marginRight: 10 }}
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

        {livePriorDebt > 0 && (
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginBottom: 12 }}>
            {`This customer has an existing balance of KES ${livePriorDebt.toLocaleString()}.`}
          </Text>
        )}

        {isExistingDebt ? (
          <LegacyDebtForm
            description={debtDescription}
            onDescriptionChange={setDebtDescription}
            category={debtCategory}
            onCategoryChange={setDebtCategory}
            total={debtTotal}
            onTotalChange={setDebtTotal}
            alreadyPaid={debtAlreadyPaid}
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
  onUpdate={updateDraftItem}
  onRemove={removeItemRow}
  canRemove={items.length > 1}
  onProductSelect={({ productId, name }) => {
    const inventoryItem = allItems.find(it => it.id === productId);
    if (inventoryItem) {
      const creditCategory = inventoryCategoryToCreditCategory(inventoryItem.category);
      updateDraftItem(item.key, { productId, category: creditCategory });
    } else {
      // Fallback: just set productId if inventory item not found (shouldn't happen)
      updateDraftItem(item.key, { productId });
    }
  }}
/>
            ))}

            {/* Add another item */}
            <TouchableOpacity
              onPress={addItemRow}
              style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: Colors.primary,
                  borderStyle: 'dashed',
                  marginBottom: 20,
                }}
            >
                <MaterialIcons name="add" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
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
          <View
            style={{
              backgroundColor: Colors.secondaryContainer,
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '600' }}>
              Already paid: KES {deposit.toLocaleString()} · Remaining: KES {remainingAfterDeposit.toLocaleString()}
            </Text>
          </View>
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