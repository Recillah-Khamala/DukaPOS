// components/credit/CreditLedgerTab.tsx
import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Card from '../ui/Card';
import CustomerCard from '../ui/CustomerCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useCreditLedger, CreditItemCategory } from '../../hooks/useCreditLedger';
import type { CreditEntry } from '../../context/CreditLedgerContext';
import { getCustomerAgingTier, getEntryAgeDays } from '../../utils/creditAgingHelpers';
import { useRouter } from 'expo-router';

const CATEGORY_LABELS: Record<CreditItemCategory, string> = {
  cereal: 'Cereal',
  milling: 'Milling',
  bags: 'Bags',
  other: 'Other',
};

type CategoryBalanceMap = Partial<Record<CreditItemCategory, number>>;

type CustomerMapData = {
    name: string;
    entries: CreditEntry[];
    lastUpdated: string;
    categoryBalances: CategoryBalanceMap;
};

interface CreditLedgerTabProps {
  bottomNavHeight?: number;
}

const CreditLedgerTab: React.FC<CreditLedgerTabProps> = ({ bottomNavHeight = 0 }) => {
  const { entries, loading } = useCreditLedger();
  const router = useRouter();

  // Clears the bottom nav bar AND the floating "New Credit Entry" button
  // (48px height + 16px offset + breathing room), which otherwise overlaps
  // the last item in the list.
  const scrollBottomPadding = bottomNavHeight + 80;

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: scrollBottomPadding }}>
          <Text style={{ color: Colors.onSurfaceVariant }}>Loading...</Text>
        </ScrollView>
      </View>
    );
  }

const activeEntries = entries.filter(e => e.status === 'active');
   const totalDebt = activeEntries.reduce((sum, e) => sum + e.balance, 0);
   const customerCount = new Set(activeEntries.map(e => e.customerId)).size;
   const atRiskBalance = activeEntries.reduce((sum, e) => {
     const age = getEntryAgeDays(e);
     return age >= 90 ? sum + e.balance : sum;
   }, 0);

   // Group by customerId, and within each customer, break down outstanding
   // balance by category so a shopkeeper can see e.g. "Cereal KES 200 · Milling KES 50"
   const customerMap: Record<string, CustomerMapData> = {};

   activeEntries.forEach(e => {
     if (!customerMap[e.customerId]) {
       customerMap[e.customerId] = { name: e.customerName, entries: [e], lastUpdated: e.lastUpdatedAt, categoryBalances: {} };
     }
     const cust = customerMap[e.customerId];
     cust.entries.push(e);
     if (e.lastUpdatedAt > cust.lastUpdated) {
       cust.lastUpdated = e.lastUpdatedAt;
     }
     e.items.forEach(item => {
       const cat = item.category ?? 'other';
       const itemBalance = item.balance ?? item.total;
       if (itemBalance > 0) {
         cust.categoryBalances[cat] = (cust.categoryBalances[cat] ?? 0) + itemBalance;
       }
     });
   });
   const customers = Object.entries(customerMap);

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        contentContainerStyle={{ padding: 16, paddingBottom: scrollBottomPadding }}
      >
        {/* Heading */}
        <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
          Shop Credit Health
        </Text>

{/* Stats row */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <Card style={{ flex: 1, marginBottom: 0, marginRight: 12 }} backgroundColor={Colors.surfaceContainerHigh}>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
              TOTAL DEBT
            </Text>
            <Text style={{ color: Colors.primary, fontSize: 24, fontWeight: '800' }}>
              KES {totalDebt.toLocaleString()}
            </Text>
          </Card>
          <Card style={{ flex: 1, marginBottom: 0 }} backgroundColor={Colors.surfaceContainerHigh}>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
              CUSTOMERS
            </Text>
            <Text style={{ color: Colors.secondary, fontSize: 24, fontWeight: '800' }}>
              {customerCount}
            </Text>
          </Card>
        </View>

        {atRiskBalance > 0 && (
          <View style={{ marginBottom: 16 }}>
            {/* Styled distinctly from TOTAL DEBT/CUSTOMERS above — this card flags
                genuine risk (90+ day unpaid balances), so it uses an error-tinted
                background/border and error-colored text instead of the neutral
                surfaceContainerHigh treatment those two share. */}
            <Card style={{ width: '100%', borderColor: Colors.error }} backgroundColor={Colors.surface}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <MaterialIcons name="warning" size={14} color={Colors.error} />
                <Text style={{ color: Colors.error, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginLeft: 4 }}>
                  AT RISK (90+ days)
                </Text>
              </View>
              <Text style={{ color: Colors.error, fontSize: 24, fontWeight: '800' }}>
                KES {atRiskBalance.toLocaleString()}
              </Text>
            </Card>
          </View>
        )}

{/* Active Debts */}
        <View style={{ marginTop: 24 }}>
          <Text style={{
            color: Colors.onSurfaceVariant,
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 8
          }}>
            Active Debts
          </Text>
          {customers.length === 0 ? (
            <Card style={{ padding: 24, alignItems: 'center', borderColor: Colors.outlineVariant }} backgroundColor="white">
              <MaterialIcons name="person-off" size={48} color={Colors.outlineVariant} />
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 8 }}>
                No active debts
              </Text>
            </Card>
          ) : (
            <>
{customers.map(([customerId, data]) => {
                 const balance = data.entries.reduce((sum, e) => sum + e.balance, 0);
                 const isHighDebt = balance > 1000;
                 const categoryEntries = Object.entries(data.categoryBalances) as [CreditItemCategory, number][];
                 const agingTier = getCustomerAgingTier(data.entries);

                 return (
                   <TouchableOpacity key={customerId} onPress={() => router.push({ pathname: '/credit-detail', params: { customerId, customerName: data.name } })}>
                     <CustomerCard
                       name={data.name}
                       balance={balance}
                       lastUpdated={data.lastUpdated}
                       categoryBalances={data.categoryBalances}
                       isHighDebt={isHighDebt}
                       agingTier={agingTier}
                       onPress={() => router.push({ pathname: '/credit-detail', params: { customerId, customerName: data.name } })}
                     />
                   </TouchableOpacity>
                 );
               })}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CreditLedgerTab;
