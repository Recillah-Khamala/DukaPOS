// components/credit/ShopLoansTab.tsx
import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import { useCreditLedger } from '../../hooks/useCreditLedger';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface ShopLoansTabProps {
  bottomNavHeight: number;
}

const ShopLoansTab: React.FC<ShopLoansTabProps> = ({ bottomNavHeight }) => {
  const { sales, loading: salesLoading } = useSalesHistory();
  const { entries, loading: creditLoading } = useCreditLedger();
  const router = useRouter();

  if (salesLoading || creditLoading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomNavHeight + 24 }}>
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

  // Real repayment rate: how much of everything ever extended on credit
  // has actually been collected, across both active and paid entries.
  const totalExtended = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalCollected = entries.reduce((sum, e) => sum + e.amountPaid, 0);
  const hasCreditHistory = totalExtended > 0;
  const repaymentRate = hasCreditHistory ? Math.round((totalCollected / totalExtended) * 100) : null;
  const outstandingCredit = entries
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + e.balance, 0);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomNavHeight + 24 }}>
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
          {/* REPAYMENT — now computed from real credit ledger data */}
          <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.outlineVariant }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.onSurfaceVariant, textTransform: 'uppercase' }}>
              REPAYMENT
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.primary }}>
              {hasCreditHistory ? `${repaymentRate}%` : 'N/A'}
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
          marginBottom: 4
        }}>
          KES {loanAmount.toLocaleString()}
        </Text>
        {outstandingCredit > 0 && (
          <Text style={{ color: Colors.primaryContainer, fontSize: 12, marginBottom: 12 }}>
            KES {outstandingCredit.toLocaleString()} currently extended to customers
          </Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.secondaryContainer,
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 32,
            width: '100%',
            alignItems: 'center',
            marginTop: outstandingCredit > 0 ? 0 : 8,
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

      {/* Loan Partners Section */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600' }}>
            Loan Partners
          </Text>
          <Text style={{ color: Colors.secondary, fontSize: 14, fontWeight: '700' }}>
            View All
          </Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, marginTop: 12, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 56, height: 56, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <MaterialIcons name="phone-iphone" size={28} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>
                Safaricom / M-Pesa
              </Text>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13 }}>
                Merchant Growth Fund
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '700' }}>
                2.5% p.m.
              </Text>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11 }}>
                Interest Rate
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, padding: 10, marginTop: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <MaterialIcons name="info" size={16} color={Colors.secondary} />
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
              Your current sales data qualifies you for an instant KES 20,000 limit increase.
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
            }}
            onPress={() => router.push('/loan-consent')}
          >
            <MaterialIcons name="share" size={18} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
              Share Data & Apply
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant, opacity: 0.7, flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
          <View style={{ width: 56, height: 56, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <MaterialIcons name="business" size={28} color={Colors.outline} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>
              Equity Bank
            </Text>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13 }}>
              SME Pivot Loan
            </Text>
          </View>
          <View style={{ backgroundColor: Colors.surfaceContainerHigh, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '700' }}>
              Locked
            </Text>
          </View>
        </View>
      </View>

      {/* Data Privacy Guarantee */}
      <View style={{
        backgroundColor: Colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Colors.outlineVariant,
        marginTop: 8
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MaterialIcons name="verified-user" size={20} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '700', marginLeft: 8 }}>
            Data Privacy Guarantee
          </Text>
        </View>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, lineHeight: 20 }}>
          Your shop's inventory and sales data is encrypted and only used to generate your Business Health Score. No financial data is shared with loan partners until you explicitly tap the 'Share Data & Apply' button. You maintain 100% ownership of your shop records.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ShopLoansTab;