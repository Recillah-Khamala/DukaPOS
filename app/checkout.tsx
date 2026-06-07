import { useState } from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import BasketItemCard from '../components/ui/BasketItemCard';
import PaymentMethodSelector from '../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../components/ui/ChangeCalculator';
import { useSharedBasket } from '../context/BasketContext';
import type { PaymentMethod } from '../types';

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const router = useRouter();
  const { items, updateQuantity, removeItem, total, clearBasket } = useSharedBasket();

  const handleConfirm = () => {
    if (items.length === 0) return;
    clearBasket();
    router.dismissAll();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Checkout" onBack={() => router.back()} />
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
        renderItem={({ item }) => (
          <View className="mb-3">
            <BasketItemCard item={item} />
            <View className="flex-row items-center justify-between mt-2 pl-14">
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                  className="h-8 w-8 items-center justify-center rounded-md bg-gray-100"
                >
                  <Text className="text-base font-semibold text-neutral-700">−</Text>
                </Pressable>
                <Text className="text-base font-medium text-neutral-900 w-8 text-center">
                  {item.qty}
                </Text>
                <Pressable
                  onPress={() => updateQuantity(item.id, item.qty + 1)}
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
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View className="mt-4 gap-4">
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
              <ChangeCalculator
                totalBill={total}
                cashReceived={cashReceived}
                onCashReceivedChange={setCashReceived}
              />
              <Pressable
                onPress={handleConfirm}
                className="w-full py-3.5 rounded-lg items-center"
                style={{ backgroundColor: '#012d1d' }}
              >
                <Text className="text-base font-semibold text-white">
                  Confirm — KES {total.toLocaleString()}
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
      <BottomNavBar activeTab="sales" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}