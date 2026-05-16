import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { DateRange } from '../hooks/useDateFilter';
import { getTotalRevenue, getTotalTransactions, getSalesByDate } from '../utils/salesHelpers';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('reports');
  const [selectedRange, setSelectedRange] = useState<DateRange>('today');
  const router = useRouter();
  const { salesHistory, loading } = useSalesHistory();

  // Get today's date for filtering
  const today = new Date();
  const filteredSales = getSalesByDate(salesHistory, today);
  const totalRevenue = getTotalRevenue(filteredSales);
  const totalTransactions = getTotalTransactions(filteredSales);

  const handleTabChange = (tab: BottomNavTab) => {
    if (tab === 'sales') {
      router.push('/');
    } else if (tab === 'inventory') {
      router.push('/inventory');
    } else if (tab === 'credit') {
      router.push('/credit');
    } else {
      setActiveTab(tab);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <TopAppBar title="Reports" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-neutral-600">Loading...</Text>
        </View>
        <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Reports" />
      <ScrollView className="flex-1 px-4 py-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-neutral-900">
            Revenue: KES {totalRevenue.toLocaleString()}
          </Text>
          <Text className="text-lg text-neutral-600">
            Transactions: {totalTransactions}
          </Text>
        </View>
        <View className="gap-2">
          {(['today', 'this_week', 'this_month', 'all_time'] as DateRange[]).map((range) => (
            <Pressable
              key={range}
              onPress={() => setSelectedRange(range)}
              className={`p-2 rounded ${selectedRange === range ? 'bg-yellow-200' : 'bg-white'}`}
            >
              <Text>{range.replace(/_/g, ' ')}</Text>
            </Pressable>
          ))}
        </View>
        <View className="mt-4">
          {filteredSales.length === 0 ? (
            <Text className="text-neutral-500">No sales for this period</Text>
          ) : (
            filteredSales.map(sale => (
              <View key={sale.id} className="p-2 border-b border-gray-200">
                <Text className="font-medium">Sale #{sale.id}</Text>
                <Text>Total: KES {sale.total.toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}