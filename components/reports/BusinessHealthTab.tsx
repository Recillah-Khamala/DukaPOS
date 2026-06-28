import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/colors';
import { CompletedSale } from '../../types';

interface BusinessHealthTabProps {
  sales: CompletedSale[];
}

const BusinessHealthTab: React.FC<BusinessHealthTabProps> = ({ sales }) => {
  const router = useRouter();

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Today's Profit Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.label}>TODAY'S PROFIT</Text>
        <Text style={styles.amount}>KES {todayTotal.toLocaleString()}</Text>
        {percentChange !== null && (
          <View style={styles.changeRow}>
            <MaterialIcons
              name={percentChange >= 0 ? 'trending-up' : 'trending-down'}
              size={18}
              color={Colors.onPrimaryContainer}
            />
            <Text style={styles.changeText}>
              {Math.abs(percentChange)}% from yesterday
            </Text>
          </View>
        )}
      </View>

      {/* Business Health Score Card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <View>
            <Text style={styles.scoreTitle}>Business Health Score</Text>
            <Text style={styles.scoreSubtitle}>Loan Eligibility Metric</Text>
          </View>
          <View style={styles.scoreValueContainer}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>
        <View style={styles.scoreBarBackground}>
          <View style={{ width: `${score}%`, height: 8, backgroundColor: '#ffb702', borderRadius: 4 }} />
        </View>
        <View style={styles.scoreDetails}>
          <View style={styles.scoreDetailRow}>
            <MaterialIcons name="today" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.scoreDetailText}>{activeDays}-day consistency</Text>
          </View>
          <View style={{ backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, padding: 8 }}>
            <Text style={styles.loanText}>Ready for Micro-loan: KES {loanAmount.toLocaleString()}</Text>
            <Text style={styles.loanSubtext}>Based on {activeDays}-day consistency</Text>
          </View>
        </View>
      </View>

      {/* 7-Day Sales Trend Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>7-Day Sales Trend</Text>
        <View style={styles.chartContainer}>
          {dayLabels.map((day, index) => (
            <View key={day} style={styles.chartBarContainer}>
              <View style={{
                width: 20,
                height: `${(dailyTotals[index] / maxTotal) * 100}%`,
                backgroundColor: Colors.primary,
                borderRadius: 4,
                marginVertical: 4,
              }} />
              <Text style={styles.chartLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Top Selling Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Cereals</Text>
        {fastestMoving.map((item, index) => (
          <View key={item.name} style={styles.itemRow}>
            <MaterialIcons name={item.icon as any} size={24} color={Colors.primary} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>{item.qty} kg</Text>
            </View>
          />
        ))}
      </View>

      {/* Full Report Button */}
      <View style={styles.fullReportContainer}>
        <TouchableOpacity onPress={() => router.push('/transaction-history')}>
          <Text style={styles.fullReportText}>Full Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: Colors.onPrimaryContainer,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    color: Colors.secondaryContainer,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  changeText: {
    color: Colors.onPrimaryContainer,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scoreTitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  scoreSubtitle: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginTop: 2,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreNumber: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  scoreMax: {
    color: Colors.onSurfaceVariant,
    fontSize: 20,
  },
  scoreBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDetailText: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginLeft: 4,
  },
  loanText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  loanSubtext: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: 30,
  },
  chartLabel: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  section: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  fullReportContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  fullReportText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BusinessHealthTab;