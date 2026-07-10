import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Card from '../components/ui/Card';
import TransactionCard from '../components/ui/TransactionCard';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';
import { useSalesHistory } from '../hooks/useSalesHistory';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { sales, loading } = useSalesHistory();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  return (
    <View className="flex-1" style={{ backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Transaction History" onBack={() => router.back()} />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text style={{ color: Colors.onSurfaceVariant }}>Loading transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => String(item.id ?? '')}
          ListHeaderComponent={() => (
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
                  {sales.length} transaction{sales.length !== 1 ? 's' : ''} total
                </Text>
              </View>
          )}
            ListEmptyComponent={
            <Card style={{ alignItems: 'center', padding: 24 }}>
              <MaterialIcons name="receipt-long" size={48} color="#d1d5db" />
              <Text style={{ color: Colors.onSurfaceVariant, marginTop: 8 }}>No transactions yet</Text>
            </Card>
          }
          contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomNavHeight + 24 }}
          renderItem={({ item }) => (
            <TransactionCard
              completedAt={item.completedAt}
              itemsCount={item.items.length}
              total={item.total}
              paymentMethod={item.paymentMethod}
            />
          )}
        />
      )}

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}