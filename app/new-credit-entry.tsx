// app/new-credit-entry.tsx
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreditLedger, CreditItemCategory } from '../hooks/useCreditLedger';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useInventory } from '../context/InventoryContext';
import { useCustomers } from '../context/CustomersContext';
import type { Customer } from '../types';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import {
  parseManualDate,
  inventoryCategoryToCreditCategory,
  buildCreditEntry,
  prepareBuiltItemsAndTotal,
  computeInventoryDeductionsForSale,
  buildSaleFromEntry,
  buildExcessPaymentMessages,
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
  const { customers, loading, addCustomer: addCustomerToContext } = useCustomers();
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

  // --- Credit sale items + payment ---
  const [items, setItems] = React.useState<DraftItem[]>([makeEmptyItem()]);
  const [amountReceivedNow, setAmountReceivedNow] = React.useState('');
  const [bannerMessage, setBannerMessage] = React.useState<string | null>(null);

  // Customer selection state
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [newCustomerName, setNewCustomerName] = React.useState('');

  // Handle creating a new customer
  const handleCreateNewCustomer = async () => {
    if (!newCustomerName.trim()) {
      alert('Please enter a customer name');
      return;
    }
    try {
      // FIX: previously generated a UUID locally (via expo-crypto) and used
      // it as this screen's `customer` state, while separately calling
      // addCustomerToContext({ name }) — which mints its OWN random UUID
      // internally when it actually persists the record. That meant the
      // customer attributed to this credit entry and the customer actually
      // saved to storage ended up with two different ids.
      //
      // addCustomer now returns the Customer it actually persisted (with
      // its real id), so that's the single source of truth used here —
      // no separate id generation needed in this file at all.
      const newCustomer = await addCustomerToContext({ name: newCustomerName.trim() });
      setCustomer(newCustomer);
      setIsCreatingNew(false);
      setNewCustomerName('');
    } catch (e) {
      console.error('Failed to create customer:', e);
      alert('Failed to create customer');
    }
  };

  // Handle selecting an existing customer
  const handleSelectExistingCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setIsCreatingNew(false);
  };

  // Handle changing the customer (reset selection)
  const handleChangeCustomer = () => {
    setCustomer(null);
  };

  // Live prior-debt for the selected customer (shown inline)
  const livePriorDebt = React.useMemo(() => {
    if (!customer) return 0;
    return entries
      .filter(e => e.customerId === customer.id && e.status === 'active')
      .reduce((sum, e) => sum + e.balance, 0);
  }, [entries, customer]);

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

  const isFormValid = customer !== null &&
    (isExistingDebt
      ? parseFloat(debtTotal || '0') > 0
      : items.every(
          item =>
            item.name.trim() !== '' &&
            parseFloat(item.qty || '0') > 0 &&
            parseFloat(item.unitPrice || '0') > 0
        ));

  const handleSave = async () => {
    if (!isFormValid) return;

    // Step 1: customer identity + their existing debt.
    // Reuses livePriorDebt (already computed above for the currently
    // selected customer) instead of recomputing the same filter/reduce here.
    const customerId = customer!.id;
    const priorDebt = livePriorDebt;

    // Step 2: build items + apply deposit allocation
    const debtInfo = isExistingDebt
      ? { description: debtDescription, category: debtCategory, total: grandTotal }
      : null;
    const { builtItems, total } = prepareBuiltItemsAndTotal(isExistingDebt, items, debtInfo, allItems, deposit);

    // Step 3: compute inventory deductions (skipped entirely for legacy debt)
    let warnings: string[] = [];
    let inventoryUpdates: Array<{ id: string; currentStock: number; isLowStock: boolean }> = [];
    if (!isExistingDebt) {
      const result = computeInventoryDeductionsForSale(builtItems, allItems);
      warnings = result.warnings;
      inventoryUpdates = result.inventoryUpdates;
    }

    // Step 4: build + save the credit entry
    const createdAt = isExistingDebt ? parseManualDate(debtDay, debtMonth, debtYear) : new Date().toISOString();
    const newEntry = buildCreditEntry(customerId, customer!.name, builtItems, total, deposit, createdAt);
    await addEntry(newEntry);

    // Step 5: apply any excess deposit to the customer's OTHER existing debt.
    // Guarded to non-legacy sales only — legacy debt's "Already Paid" field is
    // scoped to that single opening balance, not the customer's whole ledger.
    if (!isExistingDebt && excessPayment > 0) {
      await recordPayment(customerId, excessPayment);
      warnings.push(...buildExcessPaymentMessages(excessPayment, priorDebt));
    }

    // Step 6: record the sale for Reports/Business Health
    const sale = buildSaleFromEntry(newEntry, builtItems, total, createdAt);
    await addSale(sale);

    // Step 7: write back inventory deductions
    inventoryUpdates.forEach(update => {
      updateItem(update.id, { currentStock: update.currentStock, isLowStock: update.isLowStock });
    });

    // Step 8: surface warnings, then navigate back
    if (warnings.length > 0) {
      setBannerMessage(warnings.join('\n'));
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
        <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
          New Credit Sale
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 20 }}>
          Record a sale on credit for a customer
        </Text>

        {/* Existing debt toggle (unchanged) */}
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

        {/* Customer Selection */}
        {customer === null ? (
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
                onPress={() => setIsCreatingNew(false)} // We'll show the list in a modal or flatlist below
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

            {/* New Customer Input */}
            {isCreatingNew && (
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
            )}

            {/* Existing Customer List */}
            {!isCreatingNew && (
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
        ) : (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>
                Customer: {customer?.name}
              </Text>
              <TouchableOpacity
                onPress={handleChangeCustomer}
                style={{ padding: 8 }}
              >
                <MaterialIcons name="edit" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Live prior debt (if any) */}
        {livePriorDebt > 0 && (
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginBottom: 12 }}>
            {`This customer has an existing balance of KES ${livePriorDebt.toLocaleString()}.`}
          </Text>
        )}

        {/* Debt mode form (existing debt or new credit entry) */}
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
                    updateDraftItem(item.key, { productId });
                  }
                }}
              />
            ))}
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
              <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>Add Another Item</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 20 }}>
          Total: KES {grandTotal.toLocaleString()}
        </Text>

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