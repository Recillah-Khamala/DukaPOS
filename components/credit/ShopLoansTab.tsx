import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import { useRouter } from 'expo-router';

const ShopLoansTab: React.FC = () => {
  const { sales, loading } = useSalesHistory();
  const router = useRouter();

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
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
  const loanAmount = score >= 80 ? 50000 : score >= 50 ? 25000 : 10000;

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

      {/* Available Credit Limit Hero Card */}
      <View style={{
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden'
      }}>
        <Text style={{ 
          color: Colors.primaryContainer, 
          fontSize: 11, 
          fontWeight: '700', 
          letterSpacing: 1, 
          textTransform: 'uppercase',
          marginBottom: 4
        }}>
          AVAILABLE CREDIT LIMIT
        </Text>
        <Text style={{ 
          color: Colors.onPrimary, 
          fontSize: 28, 
          fontWeight: '800', 
          marginBottom: 16
        }}>
          KES {loanAmount.toLocaleString()}
        </Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: Colors.secondaryContainer, 
            borderRadius: 24, 
            paddingVertical: 12, 
            paddingHorizontal: 32, 
            width: '100%', 
            alignItems: 'center' 
          }}
        >
          <Text style={{ 
            color: Colors.onSecondaryContainer, 
            fontSize: 14, 
            fontWeight: '700' 
          }}>
            Withdraw to M-Pesa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Share Data & Apply Button */}
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'alignItems: 'center'
          }}
          onPress={() => router.push('/loan-consent')}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Share Data & Apply
          </Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder */}
      <Text style={{ color: Colors.onSurfaceVariant, textAlign: 'center' }}>
        More coming soon
      </Text>
    </ScrollView>
  );
};

export default ShopLoansTab;