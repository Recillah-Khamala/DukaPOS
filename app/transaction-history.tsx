import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';
import { useSalesHistory } from '../hooks/useSalesHistory';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const { sales, loading } = useSalesHistory();

  console.log('Sales count:', sales.length);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Transaction History" onBack={() => router.back()} />
      <FlatList
        data={sales}
        keyExtractor={(sale) => sale.id}
        contentContainerStyle={{ paddingTop: 72, paddingBottom: bottomNavHeight + 24, paddingHorizontal: 16 }}
        renderItem={({ item: sale }) => (
          <View>
            <Text>{sale.id}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 48 }}>
            <Text style={{ color: Colors.onSurfaceVariant }}>No transactions yet</Text>
          </View>
        }
      />
      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}
