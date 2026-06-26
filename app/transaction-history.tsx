import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';
import Colors from '../constants/colors';
import { useSalesHistory } from '../hooks/useSalesHistory';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const { sales, loading } = useSalesHistory();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Transaction History" onBack={() => router.back()} />
      <FlatList
        data={sales}
        keyExtractor={(sale) => sale.id}
        contentContainerStyle={{ paddingTop: 72, paddingBottom: bottomNavHeight + 24, paddingHorizontal: 16 }}
        renderItem={({ item: sale }) => (
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.outlineVariant, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }}>
                {new Date(sale.completedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                {new Date(sale.completedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700' }}>
                KES {sale.total.toLocaleString()}
              </Text>
              <View style={{ backgroundColor: sale.paymentMethod === 'mpesa' ? Colors.secondaryContainer : Colors.primaryFixed, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 10, fontWeight: '700' }}>
                  {sale.paymentMethod.toUpperCase()}
                </Text>
              </View>
            </View>
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
