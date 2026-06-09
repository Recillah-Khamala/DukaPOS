import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View, Pressable } from 'react-native';
import type { BasketItem } from '../../types';
import { formatLineTotal, formatQty } from '../../utils/formatQuantity';

export type BasketItemCardProps = {
  item: BasketItem;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function BasketItemCard({ item, onDelete, onEdit }: BasketItemCardProps) {
  const isBag = item.type === 'bag';
  const hasFraction = !!item.fractionLabel;

  const qtyText = hasFraction ? item.fractionLabel : formatQty(item.qty);
  const unitLabel = item.unitLabel ?? (isBag ? 'Bag' : 'Piece');
  const lineTotal = hasFraction
    ? `${item.unitPrice.toLocaleString()} KES`
    : formatLineTotal(item.qty, item.unitPrice);

  return (
    <View
      className="flex-row items-center gap-3 rounded-lg bg-white p-3"
      style={{
        borderLeftWidth: item.isService ? 4 : 0,
        borderLeftColor: item.isService ? '#7d5800' : 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Left: Icon Container */}
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={24}
          color="#1e40af"
        />
      </View>

      {/* Middle: Item Name */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-neutral-900">{item.name}</Text>
        {isBag && (
          <View className="mt-1 self-start rounded-full bg-surface-container-high px-2 py-0.5">
            <Text className="text-xs font-bold text-on-surface-variant">Bag</Text>
          </View>
        )}
      </View>

      {/* Right: Total + edit + delete icons */}
      <View className="items-end">
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-primary">{lineTotal}</Text>
          <Pressable
            onPress={() => onEdit?.(item.id)}
            className="h-8 w-8 items-center justify-center rounded-full"
          >
            <MaterialIcons name="edit" size={20} color="#6b7280" />
          </Pressable>
          <Pressable
            onPress={() => onDelete?.(item.id)}
            className="h-8 w-8 items-center justify-center rounded-full"
          >
            <MaterialIcons name="delete-sweep" size={20} color="#9ca3af" />
          </Pressable>
        </View>
        {isBag ? (
          <Text className="text-sm text-neutral-600">
            {item.qty} × {item.variantLabel}
          </Text>
        ) : (
          <Text className="text-sm text-neutral-600">
            {qtyText} {unitLabel} @ {item.unitPrice.toLocaleString()} KES
          </Text>
        )}
      </View>
    </View>
  );
}
