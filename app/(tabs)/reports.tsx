import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';

export default function ReportsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'Business Health' | 'Market Insights'>('Business Health');
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
          }}>
            Market Insights
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{
                  color: Colors.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  7-Day Sales Trend
                </Text>
                <MaterialIcons name="bar-chart" size={24} color={Colors.onSurfaceVariant} />
              </View>
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: 120,
                paddingHorizontal: 8,
              }}>
                {last7Days.map((day, index) => (
                  <View key={index} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <View style={{
                      width: 16,
                      height: Math.max(8, (dailyTotals[index] / maxTotal) * 100),
                      backgroundColor: index === 6 ? Colors.primary : Colors.primaryFixed,
                      borderRadius: 4,
                    }}/>
                    <Text style={{ 
                      fontSize: 10, 
                      color: index === 6 ? Colors.primary : Colors.onSurfaceVariant,
                    }}>
                      {dayLabels[day.getDay()]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600' }}>Fastest Moving Items</Text>
                <Text style={{ color: Colors.secondary, fontSize: 14, fontWeight: '700' }}>Full Report</Text>
              </View>
              {fastestMoving.length === 0 ? (
                <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, alignItems: 'center' }}>
                  <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14 }}>No sales data yet</Text>
                </View>
              ) : fastestMoving.map((item, index) => (
                <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 8 }}>
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
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Market Insights coming soon</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}