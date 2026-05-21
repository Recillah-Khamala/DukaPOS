import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useDateFilter } from '../hooks/useDateFilter';
import { getTotalRevenue, getTotalTransactions, getTopProducts, getRevenueByDay, getPaymentMethodBreakdown } from '../utils/salesHelpers';
import { seedSampleSales } from '../utils/seedData';
import StatCard from '../components/ui/StatCard';
import RevenueChart from '../components/ui/RevenueChart';
import TopProductsList from '../components/ui/TopProductsList';
import DateRangeFilter from '../components/ui/DateRangeFilter';
import PaymentBreakdown from '../components/ui/PaymentBreakdown';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('reports');
  const router = useRouter();
  const { salesHistory, loading, addSale } = useSalesHistory();
  const { selectedRange, setRange, filterSales } = useDateFilter();

  const filteredSales = filterSales(salesHistory);

  const totalRevenue = getTotalRevenue(filteredSales);
  const totalTransactions = getTotalTransactions(filteredSales);
  const averageSale = totalRevenue / Math.max(totalTransactions, 1);
  const bestSellingProduct = getTopProducts(filteredSales, 1)[0]?.name ?? 'N/A';
  const topProductsData = getTopProducts(filteredSales, 5);
  const revenueChartData = getRevenueByDay(filteredSales);
  const paymentBreakdown = getPaymentMethodBreakdown(filteredSales);

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
      <ScrollView className="flex-1 px-4">
        <View className="pb-20">
          {filteredSales.length === 0 ? (
            // Empty state
            <View className="items-center justify-center flex-1 space-y-6">
              <MaterialCommunityIcons name="chart-bar" size={80} color="text-neutral-400" />
              <Text className="mt-4 text-lg font-semibold text-neutral-900">
                No sales yet
              </Text>
              <Text className="mt-2 text-neutral-500 text-center">
                Complete your first sale to see your reports here.
              </Text>
              <Pressable
                onPress={async () => {
                  const sampleSales = seedSampleSales();
                  // Clear existing data and add all sample sales
                  // First, we'll replace the entire sales history
                  // Since useSalesHistory only provides addSale, we'll need to work around this
                  // For simplicity in this test, we'll add each sale individually
                  // In a real app, you might want to add a setSalesHistory function
                  for (const sale of sampleSales) {
                    await addSale(sale);
                  }
                  // Note: This will append to existing data, not replace it
                  // For a proper seed function that replaces data, we'd need to modify the hook
                }}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Load Sample Data
              </Pressable>
            </View>
          ) : (
            // Normal content
            <View>
              <DateRangeFilter value={selectedRange} onChange={setRange} className="mb-4" />
              
              {/* Stat Cards in horizontal ScrollView */}
              <ScrollView horizontal className="space-x-3 mb-6">
                <StatCard
                  label="Total Revenue"
                  value={`KES ${totalRevenue.toLocaleString()}`}
                  icon="attach-money"
                  accentColor="emerald"
                />
                <StatCard
                  label="Total Transactions"
                  value={totalTransactions.toString()}
                  icon="shopping-cart"
                  accentColor="blue"
                />
                <StatCard
                  label="Average Sale"
                  value={`KES ${averageSale.toLocaleString()}`}
                  icon="show-chart"
                  accentColor="purple"
                />
                <StatCard
                  label="Best Selling"
                  value={bestSellingProduct}
                  icon="star"
                  accentColor="pink"
                />
              </ScrollView>
              
              {/* Revenue Chart */}
              <View className="mb-6">
                <View className="bg-white rounded-lg p-4 shadow">
                  <Text className="mb-2 text-lg font-semibold text-neutral-900">
                    Daily Revenue Trend
                  </Text>
                  <RevenueChart data={revenueChartData} />
                </View>
              </View>
              
              {/* Spacer to ensure chart has room for labels on all platforms */}
              <View className="h-4" />
              
              {/* Top Products */}
              <View className="mb-6 bg-white rounded-lg p-4">
                <Text className="mb-2 text-lg font-semibold text-neutral-900">Top Products</Text>
                <TopProductsList products={topProductsData} />
              </View>
              
              {/* Payment Breakdown */}
              <View className="mb-6 bg-white rounded-lg p-4">
                <Text className="mb-2 text-lg font-semibold text-neutral-900">Payments</Text>
                <PaymentBreakdown breakdown={paymentBreakdown} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}