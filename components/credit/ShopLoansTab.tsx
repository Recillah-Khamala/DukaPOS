import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import useSalesHistory from '../../hooks/useSalesHistory';

const ShopLoansTab: React.FC = () => {
  const { sales, loading, error } = useSalesHistory();

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={{ color: Colors.error }}>Error loading sales data</Text>
      </ScrollView>
    );
  }

  // Calculate active days in last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const activeDaysSet = new Set();
  sales.forEach((sale: any) => {
    const saleDate = new Date(sale.date);
    if (saleDate >= thirtyDaysAgo && saleDate <= today) {
      const dateString = saleDate.toISOString().split('T')[0];
      activeDaysSet.add(dateString);
    }
  });
  const activeDays = activeDaysSet.size;
  const score = Math.min(100, Math.round((activeDays / 30) * 100));

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      {/* Heading */}
      <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
        Shop Growth Dashboard
      </Text>

      {/* Business Health Score Card */}
      <View style={{
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 8,
        borderLeftColor: Colors.secondaryContainer,
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
        marginBottom: 16
      }}>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, fontWeight: '700' }}>
          Business Health Score
        </Text>
        <Text style={{ color: Colors.primary, fontSize: 32, fontWeight: '700', marginTop: 4 }}>
          {score * 10} / 1000
        </Text>
        <View style={{ height: 16, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, marginVertical: 12 }}>
          <View style={{ width: `${score}%`, height: 16, backgroundColor: Colors.secondaryContainer, borderRadius: 8 }} />
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: Colors.outlineVariant, marginBottom: 12 }} />

        {/* 3-column stats row */}
        <View style={{ flexDirection: 'row' }}>
          {/* SALES */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.onSurfaceVariant, textTransform: 'uppercase' }}>
              SALES
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.primary }}>
              +12%
            </Text>
          </View>
          {/* INVENTORY */}
          <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.outlineVariant }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.onSurfaceVariant, textTransform: 'uppercase' }}>
              INVENTORY
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.primary }}>
              Stable
            </Text>
          </View>
          {/* REPAYMENT */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.onSurfaceVariant, textTransform: 'uppercase' }}>
              REPAYMENT
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.primary }}>
              100%
            </Text>
          </View>
        </View>
      </View>

      {/* Placeholder */}
      <Text style={{ color: Colors.onSurfaceVariant, textAlign: 'center' }}>
        More coming soon
      </Text>
    </ScrollView>
  );
};

export default ShopLoansTab;