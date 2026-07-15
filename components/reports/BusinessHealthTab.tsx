import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { CompletedSale } from '../../types';
import { useInventory } from '../../context/InventoryContext';
import Card from '../../components/ui/Card';
import EmptyStateCard from '../../components/ui/EmptyStateCard';
import WarningBanner from '../../components/ui/WarningBanner';
import { computeProfitSummary } from '../../utils/profitHelpers';
import { useFuelLog } from '../../hooks/useFuelLog';
import ProfitabilityTable from './ProfitabilityTable';

interface BusinessHealthTabProps {
  sales: CompletedSale[];
  bottomNavHeight: number;
}

const BusinessHealthTab: React.FC<BusinessHealthTabProps> = ({ sales, bottomNavHeight }) => {
   const router = useRouter();
   const [bannerDismissed, setBannerDismissed] = useState(false);

   const todayStr = new Date().toDateString();
   const todaySales = sales.filter(s => new Date(s.completedAt).toDateString() === todayStr);
   const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
   const yesterdayTotal = sales
     .filter(s => new Date(s.completedAt).toDateString() === yesterdayStr)
     .reduce((sum, s) => sum + s.total, 0);

   const { allItems } = useInventory();
   const todayProfitSummary = computeProfitSummary(todaySales, allItems);
   const todayTotal = todayProfitSummary.totalRevenue;

   const percentChange = yesterdayTotal === 0 ? null :
     Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100);

   const thirtyDaysAgo = Date.now() - 30 * 86400000;
   const recentSales = sales.filter(s => new Date(s.completedAt).getTime() >= thirtyDaysAgo);
   const activeDaysSet = new Set(recentSales.map(s => new Date(s.completedAt).toDateString()));
   const activeDays = activeDaysSet.size;
   const score = Math.min(100, Math.round((activeDays / 30) * 100));
   const tier = score >= 80 ? 'Gold Tier' : score >= 50 ? 'Silver Tier' : 'Bronze Tier';
   const loanAmount = score >= 80 ? 50000 : score >= 50 ? 25000 : 10000;

   const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
   const last7Days: Date[] = [];
   for (let i = 6; i >= 0; i--) {
     last7Days.push(new Date(Date.now() - i * 86400000));
   }
   const dailyTotals = last7Days.map(day => {
     const dayStr = day.toDateString();
     return sales
       .filter(s => new Date(s.completedAt).toDateString() === dayStr)
       .reduce((sum, s) => sum + s.total, 0);
   });
   const maxTotal = Math.max(...dailyTotals) || 1;

   const productTotals: Record<string, { name: string; qty: number; icon: string; type: string }> = {};
   sales.forEach(sale => {
     sale.items.forEach(item => {
       if (!productTotals[item.productId]) {
         productTotals[item.productId] = { name: item.name, qty: 0, icon: item.icon ?? 'grain', type: item.type };
       }
       productTotals[item.productId].qty += item.qty;
     });
   });
   const fastestMoving = Object.values(productTotals)
      .filter(p => p.type === 'cereal')
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 3);

   const { entries: fuelEntries } = useFuelLog();
   const millingRevenue = sales
     .filter(s => new Date(s.completedAt).getTime() >= thirtyDaysAgo)
     .flatMap(s => s.items)
     .filter(item => item.type === 'service')
     .reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
   const totalFuelCost = fuelEntries
     .filter(e => new Date(e.date).getTime() >= thirtyDaysAgo)
     .reduce((sum, e) => sum + e.totalCost, 0);
   const millingProfit = millingRevenue - totalFuelCost;
   const isMillingProfit = millingProfit >= 0;

return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: bottomNavHeight + 24 }}>
        {!bannerDismissed && todayProfitSummary.itemsWithUnknownCost.size > 0 && (
          <TouchableOpacity
            onPress={() => {
              setBannerDismissed(true);
              router.push('/inventory');
            }}
          >
            <WarningBanner
              message={`${todayProfitSummary.itemsWithUnknownCost.size} items don't have a buying price set — profit is estimated for these. Tap to update.`}
            />
          </TouchableOpacity>
        )}

        {/* Today's Profit Hero */}
      <Card style={{ backgroundColor: Colors.primaryContainer, padding: 12, alignItems: 'center', marginBottom: 16, borderColor: Colors.outlineVariant }}>
         <Text style={{ color: Colors.onPrimaryContainer, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
           TODAY'S PROFIT
         </Text>
         <Text style={{ color: Colors.secondaryContainer, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
           KES {todayProfitSummary.totalActualProfit.toLocaleString()}
         </Text>
         {percentChange !== null && (
           <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
             <MaterialIcons
               name={percentChange >= 0 ? 'trending-up' : 'trending-down'}
               size={18}
               color={Colors.onPrimaryContainer}
             />
             <Text style={{ color: Colors.onPrimaryContainer, fontSize: 14, fontWeight: '700', marginLeft: 4 }}>
               {Math.abs(percentChange)}% from yesterday
             </Text>
           </View>
         )}
         {todayProfitSummary.itemsWithUnknownCost.size > 0 && (
           <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 2 }}>
             Actual: KES {todayProfitSummary.totalActualProfit.toLocaleString()} · Projected: KES {todayProfitSummary.totalProjectedProfit.toLocaleString()}
           </Text>
         )}
         <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 2 }}>
           Revenue: KES {todayProfitSummary.totalRevenue.toLocaleString()}
         </Text>
       </Card>

      {/* Business Health Score */}
      <Card style={{ marginBottom: 16, padding: 12, borderColor: Colors.outlineVariant }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View>
            <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>Business Health Score</Text>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 2 }}>Loan Eligibility Metric</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
              <Text style={{ color: Colors.primary, fontSize: 32, fontWeight: '700' }}>{score}</Text>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 20 }}>/100</Text>
            </View>
          </View>
          <View style={{ backgroundColor: Colors.primaryFixed, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700' }}>{tier}</Text>
          </View>
        </View>
        <View style={{ height: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 4, marginBottom: 12 }}>
          <View style={{ width: `${score}%`, height: 8, backgroundColor: '#ffb702', borderRadius: 4 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <MaterialIcons name="today" size={16} color={Colors.onSurfaceVariant} />
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginLeft: 4 }}>{activeDays}-day consistency</Text>
        </View>
        <View style={{ backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, padding: 8 }}>
          <Text style={{ color: Colors.secondary, fontSize: 14, fontWeight: '700' }}>
            Ready for Micro-loan: KES {loanAmount.toLocaleString()}
          </Text>
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}>
            Based on {activeDays}-day consistency
          </Text>
        </View>
      </Card>

      {/* 7-Day Sales Trend */}
      <Card style={{ marginBottom: 16, padding: 12, borderColor: Colors.outlineVariant }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600' }}>7-Day Sales Trend</Text>
          <MaterialIcons name="bar-chart" size={24} color={Colors.onSurfaceVariant} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingHorizontal: 8 }}>
          {last7Days.map((day, index) => (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{
                width: 16,
                height: Math.max(8, (dailyTotals[index] / maxTotal) * 100),
                backgroundColor: index === 6 ? Colors.primary : Colors.primaryFixed,
                borderRadius: 4,
              }} />
              <Text style={{ marginTop: 4, fontSize: 10, color: index === 6 ? Colors.primary : Colors.onSurfaceVariant }}>
                {DAY_LABELS[day.getDay()]}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Fastest Moving Items */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600' }}>Fastest Moving Items</Text>
          <TouchableOpacity onPress={() => router.push('/transaction-history')}>
            <Text style={{ color: Colors.secondary, fontSize: 14, fontWeight: '700' }}>Full Report</Text>
          </TouchableOpacity>
        </View>
        {fastestMoving.length === 0 ? (
          <EmptyStateCard
            icon={<MaterialIcons name="bar-chart" size={48} color={Colors.outlineVariant} />}
            message="No sales data yet"
            style={{ marginBottom: 16 }}
          />
) : fastestMoving.map((item, index) => (
            <Card key={item.name} style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', padding: 12, borderColor: Colors.outlineVariant }}>
              <View style={{ position: 'relative', width: 48, height: 48, borderRadius: 8, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <MaterialIcons name={item.icon as any} size={28} color={Colors.primary} />
                {index === 0 && (
                  <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.secondary, borderTopLeftRadius: 4, paddingHorizontal: 3, paddingVertical: 1 }}>
                    <Text style={{ color: 'white', fontSize: 8, fontWeight: '800' }}>HOT</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14 }}>{item.qty.toFixed(2)} Korokoro sold</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '700' }}>↑ {Math.round((item.qty / fastestMoving[0].qty) * 100)}%</Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>Demand</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Profitability Table */}
        <ProfitabilityTable sales={recentSales} allItems={allItems} />

        {/* Mill Profitability */}
        <Card style={{ backgroundColor: 'white', borderColor: Colors.outlineVariant, padding: 12, marginBottom: 16 }}>
          <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            Mill Profitability — Last 30 Days
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 14 }}>Milling Revenue</Text>
            <Text style={{ color: '#16a34a', fontSize: 14, fontWeight: '700' }}>KES {millingRevenue.toLocaleString()}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 14 }}>Fuel Costs</Text>
            <Text style={{ color: Colors.error, fontSize: 14, fontWeight: '700' }}>KES {totalFuelCost.toLocaleString()}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '700' }}>Net Profit</Text>
            <Text style={{ color: isMillingProfit ? Colors.primary : Colors.error, fontSize: 16, fontWeight: '800' }}>
              KES {Math.abs(millingProfit).toLocaleString()}
            </Text>
          </View>
          <Text style={{ color: isMillingProfit ? '#16a34a' : Colors.error, fontSize: 12, marginTop: 8 }}>
            {isMillingProfit ? '✓ Milling is profitable' : '⚠ Fuel costs exceed milling revenue'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/fuel-log')} style={{ marginTop: 12 }}>
            <Text style={{ color: Colors.secondary, fontSize: 13, fontWeight: '700' }}>View Fuel & Power Log →</Text>
          </TouchableOpacity>
        </Card>
     </ScrollView>
   );
};

export default BusinessHealthTab;