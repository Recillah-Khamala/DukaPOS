import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { InventoryItem } from '../../constants/inventoryData';
import Colors from '../../constants/colors';
import { useRouter } from 'expo-router';

type StockItemCardProps = {
  item: InventoryItem;
};

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export default function StockItemCard({ item }: StockItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/inventory/unit-management',
      params: { id: item.id },
    });
  };

  // Determine badge text and colors
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
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.card}>
        {/* Row 1: top row */}
        <View style={styles.topRow}>
          {/* Left side */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
            <View style={styles.iconBox}>
              <MaterialIcons name={iconName} size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.productName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </View>

          {/* Right side - badge */}
          <View style={[styles.badge, { backgroundColor: bgColor }]}>
            <Text style={[styles.badgeText, { color: textColor }]}>
              {badgeText}
            </Text>
          </View>
        </View>

        {/* Row 2: stock and price row */}
        <View style={styles.stockPriceRow}>
          {/* Left */}
          <View>
            <Text style={styles.label}>Current Stock</Text>
<Text style={styles.stockValue}>
               {item.currentStock} {item.sellingUnit}
             </Text>
          </View>

          {/* Right */}
          <View>
            <Text style={styles.label}>Price/unit</Text>
            <Text style={[styles.priceValue, { color: Colors.onSurface }]}>
              KES {item.fractionPrices[3]?.price ?? '—'}
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
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
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
    marginRight: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  description: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
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
  stockPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  stockValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 2,
  },
});