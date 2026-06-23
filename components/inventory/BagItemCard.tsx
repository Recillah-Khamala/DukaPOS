// components/inventory/BagItemCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { InventoryItem } from '../../constants/inventoryData';
import Colors from '../../constants/colors';

type BagItemCardProps = {
  item: InventoryItem;
};

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export default function BagItemCard({ item }: BagItemCardProps) {
  // Determine badge text and colors (same as StockItemCard)
  let badgeText = 'Moderate';
  let bgColor = '#fffbeb';
  let textColor = '#b45309';

  if (item.isLowStock) {
    badgeText = 'Low Stock';
    bgColor = '#fef2f2';
    textColor = '#dc2626';
  } else if (item.currentStock > item.lowStockThreshold * 4) {
    badgeText = 'Full Stock';
    bgColor = '#ecfdf5';
    textColor = '#047857';
  } else if (item.currentStock > item.lowStockThreshold * 2) {
    badgeText = 'In Stock';
    bgColor = '#ecfdf5';
    textColor = '#047857';
  }

  const iconName = (item.icon || 'grain') as MaterialIconName;

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={styles.card}>
        {/* Row 1: top row with icon and badge */}
        <View style={styles.topRow}>
          {/* Left side: icon */}
          <View style={styles.iconBox}>
            <MaterialIcons name={iconName} size={24} color={Colors.primary} />
          </View>
          {/* Right side: badge */}
          <View style={[styles.badge, { backgroundColor: bgColor }]}>
            <Text style={[styles.badgeText, { color: textColor }]}>
              {badgeText}
            </Text>
          </View>
        </View>

        {/* Row 2: product name and description */}
        <View style={styles.content}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </View>

        {/* Row 3: stock and price */}
        <View style={styles.stockPriceRow}>
          {/* Left: current stock */}
          <View style={styles.stockLeft}>
            <Text style={styles.label}>Current Stock</Text>
            <Text style={styles.stockValue}>
              {item.currentStock} {item.buyingUnit}
            </Text>
          </View>
          {/* Right: price per unit */}
          <View style={styles.stockRight}>
            <Text style={styles.label}>Price/Unit</Text>
            <Text style={styles.priceValue}>
              KES {item.fractionPrices.find(p => p.label === '1')?.price ?? '—'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primaryFixed,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    marginVertical: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  description: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  stockPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stockLeft: {
    flex: 1,
  },
  stockRight: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  stockValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
});
