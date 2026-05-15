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
import type { BasketItem, PaymentMethod } from '../types';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('sales');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'inventory') {
      router.push('/inventory');
    } else if (tab === 'reports') {
      router.push('/reports');
    }
  };

  // Hardcoded mock data for basket items
  const sampleItems: BasketItem[] = [
    {
      id: '1',
      name: 'Medium Plastic Bag',
      unitPrice: 15,
      quantity: 2,
      icon: 'shopping-bag',
      isService: false,
    },
    {
      id: '2',
      name: 'Large Woven Bag',
      unitPrice: 40,
      quantity: 3,
      icon: 'shopping-bag',
      isService: false,
    },
    {
      id: '3',
      name: 'Grade 1 Milling',
      unitPrice: 40,
      quantity: 1.5,
      icon: 'factory',
      isService: true,
    },
  ];

  // Calculate total bill from basket items
  const totalBill = sampleItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const handleHelp = () => {
    Alert.alert('Help', 'This is the DukaPOS help section');
  };

  const handleClose = () => {
    Alert.alert('Close', 'Close button pressed');
  };

  const handleClearAll = () => {
    // In a real app, we would clear the basket and reset form
    Alert.alert('Clear All', 'Basket cleared');
    // For now, just alert - in future we'd set sampleItems to empty
  };

  const handleCompleteSale = () => {
    Alert.alert('Sale Complete', `Sale completed with ${paymentMethod}\nChange: KES ${Math.max(0, cashReceived - totalBill).toLocaleString()}`);
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
          {sampleItems.map((item) => (
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
          totalBill={totalBill} 
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