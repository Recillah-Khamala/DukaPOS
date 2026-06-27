import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
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
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Transaction History" onBack={() => router.back()} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 64 }}>
              <MaterialIcons name="receipt-long" size={48} color="#d1d5db" />
              <Text style={{ color: Colors.onSurfaceVariant, marginTop: 8 }}>No transactions yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomNavHeight + 24 }}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginHorizontal: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: Colors.outlineVariant,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              {/* Left icon */}
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.primaryFixed,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
              </View>

              {/* Middle */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }}>
                  {new Date(item.completedAt).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
                  {new Date(item.completedAt).toLocaleTimeString('en-KE', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}>
                  {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {/* Right */}
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
                  KES {item.total.toLocaleString()}
                </Text>
                <View style={{
                  backgroundColor: item.paymentMethod === 'mpesa' ? Colors.secondaryContainer : Colors.primaryFixed,
                  borderRadius: 20,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}>
                  <Text style={{ color: Colors.onSurface, fontSize: 10, fontWeight: '700' }}>
                    {item.paymentMethod.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}