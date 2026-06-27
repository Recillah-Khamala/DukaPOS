import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSalesHistory } from '../hooks/useSalesHistory';
import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';
// @ts-ignore
const MaterialIcons = require('react-native-vector-icons/MaterialIcons');
// @ts-ignore
const { TopAppBar, BottomNavBar } = require('react-native-paper');
const Colors = DefaultTheme.colors;

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { sales, loading } = useSalesHistory();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  return (
    <View style={styles.container}>
      <TopAppBar
        title="Transaction History"
        onBack={() => router.back()}
        style={styles.appBar}
      />
{loading ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Text style={{ color: Colors.onSurfaceVariant }}>Loading transactions...</Text>
         </View>
       ) : (
         <FlatList
           data={sales}
           keyExtractor={(item) => String(item.id ?? '')}
           renderItem={({ item }) => (
             <View style={styles.row}>
               <View style={styles.iconContainer}>
                 <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
               </View>
               <View style={styles.middle}>
                 <Text style={styles.date}>
                   {new Date(item.completedAt).toLocaleDateString('en-KE', {
                     day: 'numeric',
                     month: 'short',
                     year: 'numeric',
                   })}
                 </Text>
                 <Text style={styles.time}>
                   {new Date(item.completedAt).toLocaleTimeString('en-KE', {
                     hour: '2-digit',
                     minute: '2-digit',
                   })}
                 </Text>
                 <Text style={styles.itemsCount}>
                   {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                 </Text>
               </View>
               <View style={styles.right}>
                 <Text style={styles.total}>
                   KES {item.total.toLocaleString()}
                 </Text>
                 <View style={[
                   styles.badge,
                   {
                     backgroundColor:
                       item.paymentMethod === 'mpesa'
                         ? Colors.secondaryContainer
                         : Colors.primaryContainer,
                   },
                 ]}>
                   <Text style={styles.badgeText}>
                     {item.paymentMethod.toUpperCase()}
                   </Text>
                 </View>
               </View>
             </View>
           )}
           ListHeaderComponent={() => (
             <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
               <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
                 {sales.length} transaction{sales.length !== 1 ? 's' : ''} total
               </Text>
             </View>
           )}
           ListEmptyComponent={
             <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No transactions yet</Text>
             </View>
           }
           contentContainerStyle={{ paddingTop: 12, paddingBottom: bottomNavHeight + 24 }}
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
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  middle: { flex: 1 },
  date: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  itemsCount: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 4,
  },
  right: { alignItems: 'flex-end' },
  total: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.onSurface,
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: Colors.onSurfaceVariant },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});