import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';
import type { BasketItem } from '../../types';
import { formatLineTotal } from '../../utils/formatQuantity';

export type BasketItemCardProps = {
  item: BasketItem;
};

export default function BasketItemCard({ item }: BasketItemCardProps) {
  const getQuantityDisplay = () => {
    if (item.type === 'bag') {
      return item.qty;
    }
    if (item.fractionLabel) {
      return item.fractionLabel;
    }
    return item.qty;
  };

  const getUnitDisplay = () => {
    if (item.unitLabel) {
      return item.unitLabel;
    }
    return 'Piece';
  };

  const isFraction = !!item.fractionLabel;
  const isBag = item.type === 'bag';

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

      {/* Middle: Item Name and Unit Price */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-neutral-900">{item.name}</Text>
        {isBag && (
          <View className="mt-1 self-start rounded-full bg-surface-container-high px-2 py-0.5">
            <Text className="text-xs font-bold text-on-surface-variant">Bag</Text>
          </View>
        )}
        <Text className="text-sm text-neutral-500">
          KSh {item.unitPrice.toLocaleString()} each
        </Text>
      </View>

{/* Right: Total Price and Quantity */}
      <View className="items-end">
        <Text className="text-lg font-bold text-neutral-900">
          {formatLineTotal(item.qty, item.unitPrice)}
        </Text>
        {isBag ? (
          <Text className="text-sm text-neutral-600">
            {getQuantityDisplay()} × {item.variantLabel} {item.name}
          </Text>
        ) : isFraction ? (
          <Text className="text-sm text-neutral-600">
            {getQuantityDisplay()} {getUnitDisplay()}
          </Text>
        ) : (
          <Text className="text-sm text-neutral-600">
            {getQuantityDisplay()} × {getUnitDisplay()}
          </Text>
        )}
      </View>
    </View>
  );
}