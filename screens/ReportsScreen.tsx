import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useDateFilter, DateRange } from '../hooks/useDateFilter';
import { getTotalRevenue, getTotalTransactions, getTopProducts } from '../utils/salesHelpers';
import StatCard from '../components/ui/StatCard';
import RevenueChart from '../components/ui/RevenueChart';
import TopProductsList from '../components/ui/TopProductsList';
import DateRangeFilter from '../components/ui/DateRangeFilter';
import PaymentBreakdown from '../components/ui/PaymentBreakdown';
import { getPaymentMethodBreakdown } from '../utils/salesHelpers';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('reports');
  const router = useRouter();
  const { salesHistory, loading } = useSalesHistory();
  const { selectedRange, setRange, filterSales } = useDateFilter();

  const filteredSales = filterSales(salesHistory);
  // Use real filtered sales when available; otherwise use deterministic mock data for visual testing
  const mockSales = [
    {
      id: 'm-001',
      items: [{ id: 'p1', name: 'Tea Leaves - Premium', unitPrice: 70, quantity: 42, icon: 'local-cafe' }],
      total: 3010,
      paymentMethod: 'cash' as const,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm-002',
      items: [{ id: 'p2', name: 'Sugar (2kg)', unitPrice: 64.48, quantity: 35, icon: 'shopping-cart' }],
      total: 2257,
      paymentMethod: 'mpesa' as const,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm-003',
      items: [{ id: 'p3', name: 'Maize Flour', unitPrice: 64.2857, quantity: 28, icon: 'local-dining' }],
      total: 1800,
      paymentMethod: 'cash' as const,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const visualSales = filteredSales.length > 0 ? filteredSales : mockSales;

  const totalRevenue = getTotalRevenue(visualSales);
  const totalTransactions = getTotalTransactions(visualSales);

  // Payment breakdown: amounts and counts (use visualSales)
  const paymentAmounts = visualSales.reduce(
    (acc: { cash: number; mpesa: number }, sale) => {
      if (sale.paymentMethod === 'cash') acc.cash += sale.total;
      else if (sale.paymentMethod === 'mpesa') acc.mpesa += sale.total;
      return acc;
    },
    { cash: 0, mpesa: 0 }
  );

  const paymentCounts = getPaymentMethodBreakdown(visualSales as any);

  // Prepare chart data; if there are no sales, inject deterministic sample data
  const revenueChartData = (() => {
    const grouped = visualSales.reduce((acc: Record<string, number>, sale) => {
      const date = new Date(sale.createdAt || Date.now()).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});

    const arr = Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));
    arr.sort((a, b) => a.date.localeCompare(b.date));
    const last7 = arr.slice(-7);

    // Return the actual last 7 days of revenue (may be empty).
    return last7;
  })();

  // Top products: compute from visualSales (real or mock)
  const _topProducts = getTopProducts(visualSales as any, 5);
  const topProductsData = _topProducts;

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
        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="Total Revenue"
              value={`KES ${totalRevenue.toLocaleString()}`}
              icon="attach-money"
              accentColor="emerald"
              trend="+12%"
            />
            <StatCard
              label="Total Transactions"
              value={totalTransactions.toString()}
              icon="shopping-cart"
              accentColor="blue"
              trend="+5%"
            />
            <StatCard
              label="Average Sale"
              value={`KES ${(totalRevenue / Math.max(totalTransactions, 1)).toLocaleString()}`}
              icon="show-chart"
              accentColor="purple"
              trend="+8%"
            />
          </View>
          
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
            <PaymentBreakdown breakdown={paymentAmounts} counts={paymentCounts} />
          </View>
          
          <View className="mt-4">
            <DateRangeFilter value={selectedRange} onChange={setRange} />
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