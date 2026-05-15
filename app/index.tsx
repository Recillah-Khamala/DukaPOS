import { useState } from 'react';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, Text, View } from 'react-native';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import BasketItemCard from '../components/ui/BasketItemCard';
import PaymentMethodSelector from '../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../components/ui/ChangeCalculator';
import type { BasketItem, PaymentMethod } from '../types';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('sales');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const handleHelp = () => {
    Alert.alert('Help', 'This is the DukaPOS help section');
  };

  const handleClose = () => {
    Alert.alert('Close', 'Close button pressed');
  };

  // Sample basket items for demonstration
  const sampleItems: BasketItem[] = [
    {
      id: '1',
      name: 'Laptop Repair',
      unitPrice: 5000,
      quantity: 1,
      icon: 'build',
      isService: true,
    },
    {
      id: '2',
      name: 'USB Cable',
      unitPrice: 500,
      quantity: 3,
      icon: 'cable',
      isService: false,
    },
    {
      id: '3',
      name: 'Wireless Mouse',
      unitPrice: 1200,
      quantity: 2,
      icon: 'mouse',
      isService: false,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="DukaPOS" onHelp={handleHelp} onClose={handleClose} />
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-4 text-2xl font-semibold text-neutral-900">Basket Items</Text>
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
        <ChangeCalculator totalBill={8900} className="my-6" />
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <StatusBar style="auto" />
    </View>
  );
}
