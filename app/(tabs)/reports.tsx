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
  
  // Average daily sales in last 30 days
  const totalRecentSales = recentSales.reduce((sum, s) => sum + s.total, 0);
  const avgDailySales = activeDays > 0 ? totalRecentSales / activeDays : 0;
  
  // Loan amount estimate: 30% of monthly sales (avg daily * 30)
  const loanAmount = avgDailySales * 30 * 0.3;
  
  // Tier based on average daily sales
  let tier = 'Bronze';
  if (avgDailySales >= 10000) tier = 'Platinum';
  else if (avgDailySales >= 5000) tier = 'Gold';
  else if (avgDailySales >= 1000) tier = 'Silver';
  
  const score = Math.min(100, Math.round((activeDays / 30) * 100));
  
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

  console.log('Today total:', todayTotal, 'Percent change:', percentChange);
  console.log('Active days:', activeDays, 'Avg daily sales:', avgDailySales, 'Loan amount:', loanAmount, 'Tier:', tier);

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
                    color: Colors.primary,
                    fontSize: 24,
                    fontWeight: '800',
                    marginTop: 4,
                  }}>
                    {score}
                  </Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="account-balance" size={16} color={Colors.onSurfaceVariant} />
                  <Text style={{
                    color: Colors.onSurfaceVariant,
                    fontSize: 14,
                    marginLeft: 4,
                  }}>
                    KES {loanAmount.toLocaleString()}
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
                color: Colors.primary,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 12,
              }}>
                Sales Trend (Last 7 Days)
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-around',
                paddingHorizontal: 8 
              }}>
                {last7Days.map((day, index) => (
                  <View key={index} style={{ alignItems: 'center' }}>
                    <Text style={{ 
                      fontSize: 10, 
                      color: index === 6 ? Colors.primary : Colors.onSurfaceVariant,
                      marginBottom: 4,
                    }}>
                      {dayLabels[day.getDay()]}
                    </Text>
                    <View style={{
                      width: 20,
                      height: (dailyTotals[index] / maxTotal) * 80, 
                      backgroundColor: index === 6 ? Colors.primary : Colors.primaryFixed,
                      borderRadius: 4,
                    }}/>
                  </View>
                ))}
              </View>
            </View>
            
            <Text>More coming soon</Text>
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