import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';

export default function ReportsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'Business Health' | 'Market Insights' | 'Poshomill'>('Business Health');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);
  const { sales } = useSalesHistory();

  const todayStr = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.completedAt).toDateString() === todayStr);
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  const yesterdayTotal = sales
    .filter(s => new Date(s.completedAt).toDateString() === yesterdayStr)
    .reduce((sum, s) => sum + s.total, 0);
  const percentChange = yesterdayTotal === 0 ? null : 
    Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100);
  
  // Calculate Business Health Score metrics
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const recentSales = sales.filter(s => new Date(s.completedAt).getTime() >= thirtyDaysAgo);
  
  // Active days: unique days with sales in last 30 days
  const activeDaysSet = new Set(recentSales.map(s => new Date(s.completedAt).toDateString()));
  const activeDays = activeDaysSet.size;
  
  const score = Math.min(100, Math.round((activeDays / 30) * 100));
  const tier = score >= 80 ? 'Gold Tier' : score >= 50 ? 'Silver Tier' : 'Bronze Tier';
  const loanAmount = score >= 80 ? 50000 : score >= 50 ? 25000 : 10000;
  
  // 7-Day Sales Trend data
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    last7Days.push(day);
  }
  const dailyTotals = last7Days.map(day => {
    const dayStr = day.toDateString();
    const daySales = sales.filter(s => new Date(s.completedAt).toDateString() === dayStr);
    return daySales.reduce((sum, s) => sum + s.total, 0);
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

  const demandItems = [
    { name: 'Maize', icon: 'grass', percent: 88, note: 'Kitale: +24% vs National' },
    { name: 'Millet', icon: 'eco', percent: 62, note: 'Kitale: +8% vs National' },
    { name: 'Sorghum', icon: 'grain', percent: 45, note: 'Kitale: -4% vs National' },
  ];

  const topShops = [
    { initials: 'WM', name: 'Wekesa Millers', tag: 'High Volume', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'KM', name: 'Kitale Maize Hub', tag: 'Steady Repayment', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'CP', name: 'Cherangani Posho', tag: 'Peak Season Growth', icon: 'star', iconColor: Colors.secondary },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 12,
        backgroundColor: Colors.primary,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <MaterialIcons name="assessment" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <MaterialIcons name="notifications-none" size={24} color="white" />
      </View>

      <View style={{ flexDirection: 'row', height: 44 }}>
        <TouchableOpacity
          style={[
            activeTab === 'Business Health' ? { backgroundColor: Colors.secondaryContainer } : {},
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
          onPress={() => setActiveTab('Business Health')}
        >
<Text style={{ 
             color: activeTab === 'Business Health' ? Colors.onSecondaryContainer : Colors.onSurfaceVariant,
             fontWeight: activeTab === 'Business Health' ? '600' : '400',
             fontSize: 13,
           }}>
             Business Health
           </Text>
        </TouchableOpacity>
<TouchableOpacity
           style={[
             activeTab === 'Market Insights' ? { backgroundColor: Colors.secondaryContainer } : {},
             { flex: 1, justifyContent: 'center', alignItems: 'center' },
           ]}
           onPress={() => setActiveTab('Market Insights')}
         >
           <Text style={{ 
             color: activeTab === 'Market Insights' ? Colors.onSecondaryContainer : Colors.onSurfaceVariant,
             fontWeight: activeTab === 'Market Insights' ? '600' : '400',
             fontSize: 13,
           }}>
             Market Insights
           </Text>
         </TouchableOpacity>
         <TouchableOpacity
           style={[
             activeTab === 'Poshomill' ? { backgroundColor: Colors.secondaryContainer } : {},
             { flex: 1, justifyContent: 'center', alignItems: 'center' },
           ]}
           onPress={() => setActiveTab('Poshomill')}
         >
           <Text style={{
             color: activeTab === 'Poshomill' ? Colors.onSecondaryContainer : Colors.onSurfaceVariant,
             fontWeight: activeTab === 'Poshomill' ? '600' : '400',
             fontSize: 13,
           }}>
             Poshomill
           </Text>
         </TouchableOpacity>
       </View>

<ScrollView
         style={{ flex: 1 }}
         keyboardShouldPersistTaps="handled"
         contentContainerStyle={{ paddingBottom: bottomNavHeight + 24 }}
       >
         {activeTab === 'Business Health' ? (
           <View style={{ padding: 16 }}>
             <View style={{
               backgroundColor: Colors.primaryContainer,
               borderRadius: 12,
               padding: 16,
               alignItems: 'center',
               marginBottom: 16,
             }}>
               <Text style={{
                 color: Colors.onPrimaryContainer,
                 fontSize: 12,
                 fontWeight: '700',
                 textTransform: 'uppercase',
                 letterSpacing: 0.5,
               }}>
                 TODAY'S PROFIT
               </Text>
               <Text style={{
                 color: Colors.secondaryContainer,
                 fontSize: 28,
                 fontWeight: '800',
                 marginTop: 4,
               }}>
                 KES {todayTotal.toLocaleString()}
               </Text>
               {percentChange !== null && (
                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                   <MaterialIcons
                     name={percentChange >= 0 ? 'trending-up' : 'trending-down'}
                     size={18}
                     color={Colors.onPrimaryContainer}
                   />
                   <Text style={{
                     color: Colors.onPrimaryContainer,
                     fontSize: 14,
                     fontWeight: '700',
                     marginLeft: 4,
                   }}>
                     {Math.abs(percentChange)}% from yesterday
                   </Text>
                 </View>
               )}
             </View>
             
             {/* Business Health Score Card */}
             <View style={{
               backgroundColor: 'white',
               borderWidth: 1,
               borderColor: Colors.outlineVariant,
               borderRadius: 12,
               padding: 16,
               marginBottom: 16,
             }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                 <View>
                   <Text style={{
                     color: Colors.primary,
                     fontSize: 14,
                     fontWeight: '600',
                   }}>
                     Business Health Score
                   </Text>
                   <Text style={{
                     color: Colors.onSurfaceVariant,
                     fontSize: 14,
                     marginTop: 2,
                   }}>
                     Loan Eligibility Metric
                   </Text>
                   <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 }}>
                     <Text style={{
                       color: Colors.primary,
                       fontSize: 32,
                       fontWeight: '700',
                     }}>
                       {score}
                     </Text>
                     <Text style={{
                       color: Colors.onSurfaceVariant,
                       fontSize: 20,
                     }}>
                       /100
                     </Text>
                   </View>
                 </View>
                 <View style={{
                   backgroundColor: Colors.primaryFixed,
                   borderRadius: 20,
                   paddingHorizontal: 12,
                   paddingVertical: 4,
                 }}>
                   <Text style={{
                     color: Colors.primary,
                     fontSize: 12,
                     fontWeight: '700',
                   }}>
                     {tier}
                   </Text>
                 </View>
               </View>
               
               <View style={{ height: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 4, marginTop: 8, marginBottom: 12 }}>
                 <View style={{ width: `${score}%`, height: 8, backgroundColor: '#ffb702', borderRadius: 4 }} />
               </View>
               
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                   <MaterialIcons name="today" size={16} color={Colors.onSurfaceVariant} />
                   <Text style={{
                     color: Colors.onSurfaceVariant,
                     fontSize: 14,
                     marginLeft: 4,
                   }}>
                     {activeDays}-day consistency
                   </Text>
                 </View>
               </View>
               
               <View style={{ backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, padding: 8 }}>
                 <Text style={{
                   color: Colors.secondary,
                   fontSize: 14,
                   fontWeight: '700',
                 }}>
                   Ready for Micro-loan: KES {loanAmount.toLocaleString()}
                 </Text>
                 <Text style={{
                   color: Colors.onSurfaceVariant,
                   fontSize: 12,
                   marginTop: 2,
                 }}>
                   Based on {activeDays}-day consistency
                 </Text>
               </View>
             </View>
             
             {/* 7-Day Sales Trend Chart */}
             <View style={{
               backgroundColor: 'white',
               borderWidth: 1,
               borderColor: Colors.outlineVariant,
               borderRadius: 12,
               padding: 16,
               marginBottom: 16,
             }}>
               <Text style={{
                 color: Colors.onSurfaceVariant,
                 fontSize: 12,
                 fontWeight: '600',
                 marginBottom: 8,
               }}>
                 7-Day Sales Trend
               </Text>
               <View style={{ height: 200 }}>
                 {/* Chart would go here - simplified for now */}
                 <View style={{ 
                   flexDirection: 'row', 
                   justifyContent: 'space-between', 
                   paddingHorizontal: 12 
                 }}>
                   {dayLabels.map((day, index) => (
                     <View key={index} style={{ alignItems: 'center', width: 30 }}>
                       <View style={{ 
                         width: 20, 
                         height: `${(dailyTotals[index] / maxTotal) * 100}%`, 
                         backgroundColor: Colors.primary,
                         borderRadius: 4,
                         marginVertical: 4
                       }} />
                       <Text style={{ fontSize: 10, color: Colors.onSurfaceVariant }}>{day}</Text>
                     </View>
                   ))}
                 </View>
               </View>
             </View>
             
             {/* Top Selling Items */}
             <View style={{
               backgroundColor: 'white',
               borderWidth: 1,
               borderColor: Colors.outlineVariant,
               borderRadius: 12,
               padding: 16,
               marginBottom: 16,
             }}>
               <Text style={{
                 color: Colors.onSurfaceVariant,
                 fontSize: 16,
                 fontWeight: '600',
                 marginBottom: 12,
               }}>
                 Top Selling Cereals
               </Text>
{fastestMoving.map((item, index) => (
                  <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: Colors.outlineVariant }}>
                    <MaterialIcons name={item.icon as any} size={24} color={Colors.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant }}>{item.qty} kg</Text>
                    </View>
                  </View>
                ))}
             </View>
             
             {/* Demand Forecast */}
             <View style={{
               backgroundColor: 'white',
               borderWidth: 1,
               borderColor: Colors.outlineVariant,
               borderRadius: 12,
               padding: 16,
               marginBottom: 16,
             }}>
               <Text style={{
                 color: Colors.onSurfaceVariant,
                 fontSize: 16,
                 fontWeight: '600',
                 marginBottom: 12,
               }}>
                 Demand Forecast (Kitale vs National)
               </Text>
               {demandItems.map((item) => (
                 <View key={item.name} style={{ marginBottom: 12 }}>
                   <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                   <View style={{ height: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 4 }}>
                     <View style={{ width: `${item.percent}%`, height: 8, backgroundColor: Colors.primary, borderRadius: 4 }} />
                   </View>
                   <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant }}>{item.note}</Text>
                 </View>
               ))}
             </View>
             
             {/* Top Shops in Kitale */}
             <View style={{
               backgroundColor: 'white',
               borderWidth: 1,
               borderColor: Colors.outlineVariant,
               borderRadius: 12,
               padding: 16,
             }}>
               <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Top Shops in Kitale</Text>
               {topShops.map((shop) => (
                 <View key={shop.name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                   <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                     <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '700' }}>{shop.initials}</Text>
                   </View>
                   <View style={{ flex: 1 }}>
                     <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '700' }}>{shop.name}</Text>
                     <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>{shop.tag}</Text>
                   </View>
                   <MaterialIcons name={shop.icon as any} size={24} color={shop.iconColor} />
                 </View>
               ))}
             </View>
           </View>
         ) : activeTab === 'Market Insights' ? (
           <ScrollView
             style={{ padding: 16, paddingBottom: 24 }}
             showsVerticalScrollIndicator={false}
           >
             <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Market Prices & Trends</Text>
             
             {/* Price Cards */}
             <View style={{ marginBottom: 24 }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                 {[
                   { name: 'Maize', price: 'KES 4,200', change: '+12%', trend: 'up', icon: 'trending-up' },
                   { name: 'Wheat', price: 'KES 3,800', change: '-5%', trend: 'down', icon: 'trending-down' },
                   { name: 'Sorghum', price: 'KES 2,900', change: '+8%', trend: 'up', icon: 'trending-up' },
                   { name: 'Millet', price: 'KES 3,200', change: '+3%', trend: 'up', icon: 'trending-up' },
                 ].map((item, index) => (
                   <View key={item.name} style={{ width: '48%', marginBottom: 12 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                       <Text style={{ color: item.trend === 'up' ? Colors.primary : Colors.error }}>{item.price}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                       <MaterialIcons name={item.icon as any} size={16} color={item.trend === 'up' ? Colors.primary : Colors.error} />
                       <Text style={{ marginLeft: 4, fontSize: 12 }}>{item.change}</Text>
                     </View>
                   </View>
                 ))}
               </View>
             </View>
             
             {/* Market Trends */}
             <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: 12, padding: 16, marginBottom: 16 }}>
               <Text style={{ color: Colors.onSurfaceVariant, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Market Trends</Text>
               <View style={{ height: 120 }}>
                 {/* Simplified trend chart */}
                 <View style={{ 
                   flexDirection: 'row', 
                   justifyContent: 'space-around', 
                   alignItems: 'flex-end', 
                   paddingVertical: 8 
                 }}>
                   {[4, 7, 3, 5, 8, 6, 9].map((value, index) => (
                     <View key={index} style={{ width: 20 }}>
                       <View style={{ 
                         width: 20, 
                         height: `${value * 10}%`, 
                         backgroundColor: Colors.primary,
                         borderRadius: 4,
                         marginBottom: 4
                       }} />
                       <Text style={{ fontSize: 10, color: Colors.onSurfaceVariant }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index]}</Text>
                     </View>
                   ))}
                 </View>
               </View>
             </View>
             
             {/* Agricultural News */}
             <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: 12, padding: 16 }}>
               <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Latest Agricultural News</Text>
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ fontWeight: '600' }}>Fertilizer Subsidy Update</Text>
                 <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>Government announces 15% subsidy for planting season</Text>
               </View>
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ fontWeight: '600' }}>Weather Forecast</Text>
                 <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>Expected rainfall: 80-100mm this week</Text>
               </View>
               <View>
                 <Text style={{ fontWeight: '600' }}>Market Advisory</Text>
                 <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>Best time to sell: Early morning hours</Text>
               </View>
             </View>
           </ScrollView>
         ) : activeTab === 'Poshomill' ? (
<View style={{ padding: 16 }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 16 }}>
                  Poshomill coming soon
                </Text>
              </View>
            </View>
) : null}
        </ScrollView>

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}