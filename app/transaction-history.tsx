import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TopAppBar, BottomNavBar, Colors } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSalesHistory } from '../hooks/useSalesHistory';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { sales, loading } = useSalesHistory();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  console.log('Sales count:', sales.length);

  return (
    <View style={styles.container}>
      <TopAppBar
        title="Transaction History"
        onBack={() => router.back()}
        style={styles.appBar}
      />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => String(item.id ?? '')}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.id}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: bottomNavHeight }}
        />
      )}
      <BottomNavBar
        activeTab="reports"
        onHeightMeasured={setBottomNavHeight}
        style={styles.bottomNav}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  appBar: { backgroundColor: Colors.primary },
  item: { padding: 16, borderBottomWidth: 1, borderColor: Colors.divider },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: Colors.onSurfaceVariant },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});