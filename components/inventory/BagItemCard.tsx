import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import type { InventoryItem } from '../../constants/inventoryData';

export default function BagItemCard({ item }: { item: InventoryItem }) {
  let badgeText = 'Moderate';
  let bgColor = Colors.secondaryContainer;
  let textColor = Colors.onSecondaryContainer;

  if (item.isLowStock) {
    badgeText = 'Low Stock';
    bgColor = '#fef2f2';
    textColor = '#dc2626';
  } else if (item.currentStock > item.lowStockThreshold * 4) {
    badgeText = 'Full Stock';
    bgColor = Colors.primaryFixed;
    textColor = Colors.primary;
  }

  const unitPrice = item.fractionPrices?.[3]?.price ?? '—';

  return (
    <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryFixed, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name={(item.icon as any) || 'local-mall'} size={24} color={Colors.primary} />
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: bgColor }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: textColor }}>{badgeText}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.onSurface, marginBottom: 2 }}>{item.name}</Text>
      {item.description && <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 8 }}>{item.description}</Text>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
        <View>
          <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant }}>Current Stock</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.primary }}>{item.currentStock} {item.buyingUnit}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant }}>Price/Unit</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurface }}>KES {unitPrice}</Text>
        </View>
      </View>
    </View>
  );
}