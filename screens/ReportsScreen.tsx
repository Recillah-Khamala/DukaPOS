import { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { useDateFilter, DateRange } from '../hooks/useDateFilter';
import { getTotalRevenue, getTotalTransactions } from '../utils/salesHelpers';
import StatCard from '../components/ui/StatCard';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('reports');
  const router = useRouter();
  const { salesHistory, loading } = useSalesHistory();
  const { selectedRange, setRange, filterSales } = useDateFilter();

  const filteredSales = filterSales(salesHistory);
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
         <View className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           <StatCard
             label="Total Revenue"
             value={`KES ${totalRevenue.toLocaleString()}`}
             icon="attach_money"
             accentColor="emerald"
             trend="+12%"
           />
           <StatCard
             label="Total Transactions"
             value={totalTransactions.toString()}
             icon="shopping_cart"
             accentColor="blue"
             trend="+5%"
           />
           <StatCard
             label="Average Sale"
             value={`KES ${(totalRevenue / Math.max(totalTransactions, 1)).toLocaleString()}`}
             icon="show_chart"
             accentColor="purple"
             trend="+8%"
           />
         </View>
         <View className="mt-4 gap-2">
           {(['today', 'this_week', 'this_month', 'all_time'] as DateRange[]).map((range) => (
             <Pressable
               key={range}
               onPress={() => setRange(range)}
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