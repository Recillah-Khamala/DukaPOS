import { useState } from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import BasketItemCard from '../components/ui/BasketItemCard';
import PaymentMethodSelector from '../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../components/ui/ChangeCalculator';
import AdjustItemModal from '../components/sales/AdjustItemModal';
import { useSharedBasket } from '../context/BasketContext';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useInventory } from '../context/InventoryContext';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES, BAG_PRODUCTS } from '../constants/salesData';
import type { PaymentMethod, UnitType, CompletedSale, BasketItem } from '../types';

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
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState<BasketItem | null>(null);
  const router = useRouter();
  const { items, updateQuantity, removeItem, updateItem, total, clearBasket } = useSharedBasket();
  const { addSale } = useSalesHistory();
  const { getItemById, updateItem: updateInventoryItem } = useInventory();

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
                <View className="bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-center font-bold text-primary text-lg">
                    M-Pesa Total: KES {total.toLocaleString()}
                  </Text>
                </View>
              ) : paymentMethod === 'credit' ? (
                <View className="bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-center text-sm text-on-surface-variant italic">
                    Credit sale — customer ledger coming soon
                  </Text>
                </View>
              ) : (
                <ChangeCalculator
                  totalBill={total}
                  cashReceived={cashReceived}
                  onCashReceivedChange={setCashReceived}
                />
              )}
              <Pressable
                onPress={handleConfirm}
                disabled={items.length === 0}
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