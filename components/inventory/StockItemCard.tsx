import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryItem } from '../../constants/inventoryData';
import Colors from '../../constants/colors';

type StockItemCardProps = {
  item: InventoryItem;
};

export default function StockItemCard({ item }: StockItemCardProps) {
  // Calculate progress bar width
  const maxStock = item.lowStockThreshold * 4;
  const progressWidth = Math.min((item.currentStock / maxStock) * 100, 100);

  return (
    <View style={styles.card}>
      {/* Row 1: Product name and low stock badge */}
      <View style={styles.row}>
        <Text style={styles.productName}>{item.name}</Text>
        {item.isLowStock && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.badgeText}>Low Stock</Text>
          </View>
        )}
      </View>

      {/* Row 2: Current stock and unit */}
      <Text style={styles.stockInfo}>{item.currentStock} {item.unit}</Text>

      {/* Row 3: Progress bar */}
      <View style={styles.progressContainer}>
        <View 
          style={[styles.progressBar, { 
            width: `${progressWidth}%`,
            backgroundColor: item.isLowStock ? '#ef4444' : Colors.primary 
          }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8, // rounded-xl in tailwind is 8px
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    flex: 1,
  },
  lowStockBadge: {
    backgroundColor: '#fef2f2',
    borderRadius: 9999, // rounded-full
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#dc2626',
  },
  stockInfo: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    height: 4,
    overflow: 'hidden',
  },
});