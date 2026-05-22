import { Pressable, Text, View } from 'react-native';
import type { Product } from '../../types';

export type ProductCardProps = {
  product: Product;
  onAdd: () => void;
  currentQty?: number;
  onRemove?: () => void;
};

export default function ProductCard({ product, onAdd, currentQty = 0, onRemove }: ProductCardProps) {
  return (
    <Pressable onPress={onAdd} disabled={currentQty > 0}>
      <View
        className="flex-row items-center gap-3 rounded-xl bg-white p-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Product info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-neutral-900" numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text className="text-sm text-neutral-500">
            {product.unit} · KES {product.price.toLocaleString()}
          </Text>
        </View>

        {/* Add / qty-adjust button */}
        {currentQty > 0 ? (
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={onRemove}
              hitSlop={4}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: '#fef3c7' }}
            >
              <Text className="text-base font-bold text-amber-900">−</Text>
            </Pressable>
            <Text className="text-base font-bold text-neutral-900 w-6 text-center">
              {currentQty}
            </Text>
            <Pressable
              onPress={onAdd}
              hitSlop={4}
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: '#012d1d' }}
            >
              <Text className="text-base font-bold text-white">+</Text>
            </Pressable>
          </View>
        ) : (
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: '#012d1d' }}
          >
            <Text className="text-lg font-bold text-white">+</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
