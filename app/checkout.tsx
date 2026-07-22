import { useState } from 'react';
import { Text, View, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import BasketItemCard from '../components/ui/BasketItemCard';
import PaymentMethodSelector from '../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../components/ui/ChangeCalculator';
import AdjustItemModal from '../components/sales/AdjustItemModal';
import Card from '../components/ui/Card';
import CustomerPicker from '../components/credit/CustomerPicker';
import { useSharedBasket } from '../context/BasketContext';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useInventory } from '../context/InventoryContext';
import { useCreditLedger, allocatePaymentToItems } from '../hooks/useCreditLedger';
import { buildCreditEntry, basketTypeToCreditCategory } from '../utils/creditEntryHelpers';
import type { CreditItem } from '../hooks/useCreditLedger';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES, BAG_PRODUCTS } from '../constants/salesData';
import type { PaymentMethod, UnitType, CompletedSale, BasketItem, Customer } from '../types';

const FRACTION_CYCLE: UnitType[] = ['korokoro', 'kg'];

const fractionValues: number[] = [0.125, 0.25, 0.5, 1];

const getNextFraction = (current: number): number | null => {
  const idx = fractionValues.indexOf(current);
  if (idx >= 0 && idx < fractionValues.length - 1) return fractionValues[idx + 1];
  return fractionValues.find((v) => v > current) ?? null;
};

const getPrevFraction = (current: number): number | null => {
  const idx = fractionValues.indexOf(current);
  if (idx > 0) return fractionValues[idx - 1];
  return fractionValues.filter((v) => v < current).pop() ?? null;
};

const getSmallestFractionFromLabel = (label?: string): number => {
  if (!label) return 0.125;
  const parts = label.split('+').map((p) => p.trim());
  const fractionMap: Record<string, number> = {
    '1/8': 0.125,
    '1/4': 0.25,
    '1/2': 0.5,
    '1': 1,
  };
  let smallest = 0.125;
  for (const part of parts) {
    const value = fractionMap[part];
    if (value !== undefined && value < smallest) {
      smallest = value;
    }
  }
  return smallest;
};

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [creditCustomer, setCreditCustomer] = useState<Customer | null>(null);
  const [creditDepositAmount, setCreditDepositAmount] = useState('');
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState<BasketItem | null>(null);
  const router = useRouter();
  const { items, updateQuantity, removeItem, updateItem, total, clearBasket } = useSharedBasket();
  const { addSale } = useSalesHistory();
  const { getItemById, updateItem: updateInventoryItem } = useInventory();
  const { addEntry } = useCreditLedger();

  const selectedEditProduct = selectedEditItem
    ? [...CEREAL_PRODUCTS, ...POSHOMILL_SERVICES].find(
        (p) => p.id === selectedEditItem.productId
      ) || null
    : null;

  const handleEdit = (item: BasketItem) => {
    setSelectedEditItem(item);
  };

  const handleCloseEdit = () => {
    setSelectedEditItem(null);
  };

  const handleConfirm = async () => {
    if (items.length === 0) return;
    const completedSale: CompletedSale = {
      id: new Date().toISOString(),
      items: JSON.parse(JSON.stringify(items)),
      total,
      paymentMethod,
      completedAt: new Date().toISOString(),
    };
    try {
      await addSale(completedSale);
      if (paymentMethod === 'cash' && cashReceived < total) {
        return;
      }
      // Update inventory stock
      try {
        for (const item of items) {
          const inventoryItem = getItemById(item.productId);
          if (inventoryItem && inventoryItem.currentStock > 0) {
            updateInventoryItem(item.productId, {
              currentStock: Math.max(0, inventoryItem.currentStock - item.qty),
            });
          }
        }
      } catch (e) {
        console.warn('Failed to update inventory:', e);
      }
      // Credit ledger entry if credit payment
      if (paymentMethod === 'credit' && creditCustomer) {
        const rawDeposit = parseFloat(creditDepositAmount || '0') || 0;
        const deposit = Math.max(0, Math.min(rawDeposit, total));

        const creditItems: CreditItem[] = items.map(item => ({
          name: item.name,
          qty: item.qty,
          unitPrice: item.unitPrice,
          total: item.qty * item.unitPrice,
          category: basketTypeToCreditCategory(item.type),
          amountPaid: 0,
          balance: item.qty * item.unitPrice,
          productId: item.productId,
        }));
        // Same deposit-allocation math the standalone New Credit Entry
        // screen uses, so a partial payment taken here is split across
        // items identically rather than leaving every item's balance at
        // its full total the way this path used to (it never had a
        // deposit field, so amountPaid/balance never reflected one).
        const allocatedItems = deposit > 0 ? allocatePaymentToItems(creditItems, deposit) : creditItems;

        const newEntry = buildCreditEntry(
          creditCustomer.id,
          creditCustomer.name,
          allocatedItems,
          total,
          deposit,
          completedSale.completedAt
        );
        await addEntry(newEntry);
      }
      clearBasket();
      router.replace('/(tabs)/sales?saleSuccess=true&total=' + encodeURIComponent(String(total)));
    } catch (e) {
      console.warn('Failed to add sale:', e);
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'mpesa' || method === 'credit') {
      setCashReceived(0);
    }
  };

  const handleClearAll = () => {
    clearBasket();
    router.replace('/(tabs)/sales');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Checkout" onBack={() => router.back()} />
      {items.length > 0 && (
        <View className="px-4 py-3 flex-row items-center justify-between bg-white border-b border-gray-200">
          <Text className="font-label-bold text-on-surface-variant uppercase tracking-wider">
            Basket ({items.length} {items.length === 1 ? 'Item' : 'Items'})
          </Text>
          <Pressable
            onPress={handleClearAll}
            className="flex-row items-center gap-1"
          >
            <MaterialIcons name="delete-sweep" size={18} color="#dc2626" />
            <Text className="text-sm font-medium text-error">Clear All</Text>
          </Pressable>
        </View>
      )}
      <FlatList
        className="flex-1"
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 72,
          paddingHorizontal: 16,
          paddingBottom: bottomNavHeight + 24,
        }}
        ListEmptyComponent={
          <View className="items-center py-16">
            <MaterialIcons name="shopping-basket" size={48} color="#d1d5db" />
            <Text className="mt-2 text-neutral-400">Your basket is empty</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFractional = item.unitType && FRACTION_CYCLE.includes(item.unitType);
          const smallestFraction = getSmallestFractionFromLabel(item.fractionLabel);
          return (
            <View className="mb-3">
              <BasketItemCard item={item} onDelete={(id) => removeItem(id)} onEdit={() => handleEdit(item)} />
              <View className="flex-row items-center justify-between mt-2 pl-14">
                <View className="flex-row items-center gap-3">
                  <Pressable
                    onPress={() => {
                      if (isFractional && item.qty <= smallestFraction) {
                        removeItem(item.id);
                      } else if (isFractional) {
                        const next = +(item.qty - smallestFraction).toFixed(3);
                        if (next > 0) updateQuantity(item.id, next);
                      } else {
                        updateQuantity(item.id, Math.max(1, item.qty - 1));
                      }
                    }}
                    className="h-8 w-8 items-center justify-center rounded-md bg-gray-100"
                  >
                    <Text className="text-base font-semibold text-neutral-700">−</Text>
                  </Pressable>
                  <Text className="text-base font-medium text-neutral-900 w-8 text-center">
                    {isFractional ? item.fractionLabel : item.qty}
                  </Text>
                  <Pressable
                    onPress={() => {
                      if (isFractional) {
                        updateQuantity(item.id, +(item.qty + smallestFraction).toFixed(3));
                      } else {
                        updateQuantity(item.id, item.qty + 1);
                      }
                    }}
                    className="h-8 w-8 items-center justify-center rounded-md bg-gray-100"
                  >
                    <Text className="text-base font-semibold text-neutral-700">+</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  className="flex-row items-center gap-1 px-3 py-1.5 rounded-md bg-red-50"
                >
                  <MaterialIcons name="delete" size={16} color="#dc2626" />
                  <Text className="text-sm font-medium text-red-600">Remove</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          items.length > 0 ? (
            <View className="mt-4 gap-4">
              <PaymentMethodSelector value={paymentMethod} onChange={handlePaymentMethodChange} />
              {paymentMethod === 'mpesa' ? (
                <Card style={{ marginBottom: 0 }}>
                  <Text style={{ textAlign: 'center', fontWeight: '700', color: Colors.primary, fontSize: 18 }}>
                    M-Pesa Total: KES {total.toLocaleString()}
                  </Text>
                </Card>
              ) : paymentMethod === 'credit' ? (
                <Card>
                  <CustomerPicker
                    customer={creditCustomer}
                    onCustomerSelected={setCreditCustomer}
                    onChangeCustomer={() => setCreditCustomer(null)}
                  />
                  {creditCustomer && (
                    <>
                      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
                        Amount Received Now (optional)
                      </Text>
                      <TextInput
                        value={creditDepositAmount}
                        onChangeText={setCreditDepositAmount}
                        placeholder="e.g. 100"
                        keyboardType="numeric"
                        placeholderTextColor="#9ca3af"
                        style={{ borderWidth: 1.5, borderColor: Colors.outlineVariant, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, marginBottom: 4 }}
                      />
                      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                        {(() => {
                          const raw = parseFloat(creditDepositAmount || '0') || 0;
                          const deposit = Math.max(0, Math.min(raw, total));
                          return deposit > 0
                            ? `Paid now: KES ${deposit.toLocaleString()} · Remaining on credit: KES ${(total - deposit).toLocaleString()}`
                            : 'Leave blank if nothing is paid today';
                        })()}
                      </Text>
                    </>
                  )}
                </Card>
              ) : (
                <ChangeCalculator
                  totalBill={total}
                  cashReceived={cashReceived}
                  onCashReceivedChange={setCashReceived}
                />
              )}
              <Pressable
                onPress={handleConfirm}
                disabled={items.length === 0 || (paymentMethod === 'credit' && creditCustomer === null)}
                className="w-full flex-row items-center justify-center rounded-lg py-3.5 active:scale-95"
                style={{
                  backgroundColor: items.length === 0 ? '#d1d5db' : '#012d1d',
                }}
              >
                <MaterialIcons
                  name={paymentMethod === 'credit' ? 'receipt-long' : 'check-circle'}
                  size={20}
                  color={items.length === 0 ? '#9ca3af' : 'white'}
                />
                <Text
                  className="ml-2 text-base font-semibold"
                  style={{ color: items.length === 0 ? '#6b7280' : 'white' }}
                >
                  {paymentMethod === 'credit' ? 'RECORD CREDIT SALE' : 'COMPLETE SALE & PRINT'}
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
      <AdjustItemModal product={selectedEditProduct} editItem={selectedEditItem} onClose={handleCloseEdit} />
      <BottomNavBar activeTab="sales" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}