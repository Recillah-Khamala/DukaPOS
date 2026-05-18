import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type Product = {
  name: string;
  unitsSold: number;
  revenue: number;
};

export type TopProductsListProps = {
  products: Product[];
};

const AMBER = '#ffb702';
const GREEN = '#012d1d';

export default function TopProductsList({ products }: TopProductsListProps) {
  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No sales data yet</Text>
      </View>
    );
  }

  const sorted = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topRevenue = Math.max(...sorted.map((p) => p.revenue), 1);

  return (
    <View style={styles.container}>
      {sorted.map((p, idx) => {
        const rank = idx + 1;
        const pct = p.revenue / topRevenue;
        return (
          <View key={p.name} style={styles.itemWrap}>
            <View style={styles.row}>
              <Text style={styles.rank}>{rank}</Text>

              <View style={styles.mid}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {p.name}
                </Text>
                <Text style={styles.units}>{p.unitsSold} units</Text>
              </View>

              <Text style={styles.revenue}>KES {p.revenue.toLocaleString()}</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
  itemWrap: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    width: 28,
    textAlign: 'center',
    color: '#374151',
    fontWeight: '600',
  },
  mid: {
    flex: 1,
    paddingHorizontal: 8,
  },
  name: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  units: {
    fontSize: 12,
    color: '#6b7280',
  },
  revenue: {
    color: GREEN,
    fontWeight: '700',
    marginLeft: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AMBER,
  },
});
