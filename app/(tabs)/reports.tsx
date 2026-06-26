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
  console.log('Today total:', todayTotal, 'Percent change:', percentChange);

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
          <View>
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