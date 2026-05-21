import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, Text, View, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import BasketItemCard from '../components/ui/BasketItemCard';
import PaymentMethodSelector from '../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../components/ui/ChangeCalculator';
import { mockProducts } from '../constants/mockProducts';
import { useBasket } from '../hooks/useBasket';
import { useSalesHistory } from '../hooks/useSalesHistory';
import type { BasketItem, PaymentMethod, Sale } from '../types';

const ICON_MAP: Record<string, string> = {
  'Grains & Flour': 'local-flour-mill',
  'Cooking': 'local-dining',
  'Beverages': 'local-cafe',
  'Household': 'cleaning-services',
};

const initialBasketItems: BasketItem[] = mockProducts.slice(0, 3).map((product, idx) => ({
  id: product.id,
  name: product.name,
  unitPrice: product.price,
  quantity: [2, 3, 1][idx] ?? 1,
  icon: ICON_MAP[product.category] || 'shopping-bag',
}));

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('sales');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
   const { items, clearBasket, total } = useBasket(initialBasketItems);
   const { addSale } = useSalesHistory();

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'inventory') {
      router.push('/inventory');
    } else if (tab === 'reports') {
      router.push('/reports');
    } else if (tab === 'credit') {
      router.push('/credit');
    }
  };

  const handleHelp = () => {
    Alert.alert('Help', 'This is the DukaPOS help section');
  };

  const handleClose = () => {
    Alert.alert('Close', 'Close button pressed');
  };

  const handleClearAll = () => {
    clearBasket();
  };

    const handleCompleteSale = () => {
      // Create a new sale object from current basket
      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        items: items,
        total: total,
        paymentMethod: paymentMethod,
        createdAt: new Date()
      };
      
      // Save the sale to history
      addSale(newSale);
      
      // Clear the basket after successful save
      clearBasket();
      
      // Show confirmation alert
      Alert.alert('Sale Complete', `Sale completed with ${paymentMethod}\nChange: KES ${Math.max(0, cashReceived - total).toLocaleString()}`);
    };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="DukaPOS" onHelp={handleHelp} onClose={handleClose} />
      <ScrollView
        contentContainerStyle={{ 
          paddingBottom: Math.max(insets.bottom, 20) + 160 
        }}
        className="px-4 py-4"
      >
        <View className="flex justify-between items-center mb-4">
          <Text className="text-2xl font-semibold text-neutral-900">Basket Items</Text>
          <Button title="Clear All" onPress={handleClearAll} color="#012d1d" />
        </View>
        <View className="gap-3">
          {items.map((item) => (
            <BasketItemCard key={item.id} item={item} />
          ))}
        </View>
        <PaymentMethodSelector 
          value={paymentMethod} 
          onChange={setPaymentMethod} 
          className="my-6"
        />
        <View className="my-6 items-center gap-3">
          <Text className="mt-4 text-lg font-medium text-neutral-700">
            Active Tab: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Text>
          <Link href="/details" className="mt-2 text-lg font-medium text-blue-600">
            Go to details
          </Link>
        </View>
        <ChangeCalculator 
          totalBill={total} 
          cashReceived={cashReceived} 
          onCashReceivedChange={setCashReceived} 
          className="my-6" />
        <View className="my-6">
          <Button title="COMPLETE SALE & PRINT" onPress={handleCompleteSale} color="#012d1d" />
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      <StatusBar style="auto" />
    </View>
  );
}