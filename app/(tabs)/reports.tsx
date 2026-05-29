import { Text, View, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import { useDateFilter } from '../../hooks/useDateFilter';
import { useProducts } from '../../hooks/useProducts';
import { useProductSearch } from '../../hooks/useProductSearch';
import { getTotalRevenue, getTotalTransactions, getTopProducts, getRevenueByDay, getPaymentMethodBreakdown } from '../../utils/salesHelpers';
import { seedSampleSales } from '../../utils/seedData';
import StatCard from '../../components/ui/StatCard';
import RevenueChart from '../../components/ui/RevenueChart';
import TopProductsList from '../../components/ui/TopProductsList';
import DateRangeFilter from '../../components/ui/DateRangeFilter';
import PaymentBreakdown from '../../components/ui/PaymentBreakdown';
import CategoryTabs from '../../components/ui/CategoryTabs';

export default function ReportsScreen() {
  const { salesHistory, loading, addSale } = useSalesHistory();
  const { selectedRange, setRange, filterSales } = useDateFilter();
  const { products } = useProducts();
  const { selectedCategory, setSelectedCategory } = useProductSearch(products);
  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  const filteredSales = filterSales(salesHistory);

  const categoryFilteredSales =
    selectedCategory === 'All'
      ? filteredSales
      : filteredSales.filter((sale) =>
          sale.items.some((item) => {
            const product = products.find((p) => p.id === item.id);
            return product?.category === selectedCategory;
          })
        );

  const totalRevenue = getTotalRevenue(categoryFilteredSales);
  const totalTransactions = getTotalTransactions(categoryFilteredSales);
  const averageSale = totalRevenue / Math.max(totalTransactions, 1);
  const bestSellingProduct = getTopProducts(categoryFilteredSales, 1)[0]?.name ?? 'N/A';
  const topProductsData = getTopProducts(categoryFilteredSales, 5);
  const revenueChartData = getRevenueByDay(categoryFilteredSales);
  const paymentBreakdown = getPaymentMethodBreakdown(categoryFilteredSales);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 relative">
        <TopAppBar title="Reports" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-neutral-600">Loading...</Text>
        </View>
        <BottomNavBar activeTab="reports" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 relative">
      <TopAppBar title="Reports" />
      <ScrollView className="px-4">
        {categoryFilteredSales.length === 0 ? (
          <View className="items-center justify-center flex-1 space-y-6">
            <MaterialCommunityIcons name="chart-bar" size={80} color="#9ca3af" />
            <Text className="mt-4 text-lg font-semibold text-neutral-900">
              No sales yet
            </Text>
            <Text className="mt-2 text-neutral-500 text-center">
              Complete your first sale to see your reports here.
            </Text>
            <Pressable
              onPress={async () => {
                const sampleSales = seedSampleSales();
                for (const sale of sampleSales) {
                  await addSale(sale);
                }
              }}
              className="mt-6 px-6 py-3 bg-blue-600 rounded-md"
            >
              <Text className="text-white font-semibold">Load Sample Data</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <DateRangeFilter value={selectedRange} onChange={setRange} className="mb-4" />

            <CategoryTabs
              categories={allCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              className="mb-3"
            />

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

            <View className="mb-6">
              <View className="bg-white rounded-lg p-4 shadow">
                <Text className="mb-2 text-lg font-semibold text-neutral-900">
                  Daily Revenue Trend
                </Text>
                <RevenueChart data={revenueChartData} />
              </View>
            </View>

            <View className="mb-6 bg-white rounded-lg p-4">
              <Text className="mb-2 text-lg font-semibold text-neutral-900">Top Products</Text>
              <TopProductsList products={topProductsData} />
            </View>

            <View className="mb-6 bg-white rounded-lg p-4">
              <Text className="mb-2 text-lg font-semibold text-neutral-900">Payments</Text>
              <PaymentBreakdown breakdown={paymentBreakdown} />
            </View>
          </View>
        )}
      </ScrollView>
      <BottomNavBar activeTab="reports" />
    </View>
  );
}