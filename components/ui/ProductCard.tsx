import { Pressable, Text, View } from 'react-native';
import type { Product } from '../../types';

export type ProductCardProps = {
  product: Product;
  onAdd: () => void;
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Pressable onPress={onAdd}>
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

        {/* Add button */}
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: '#012d1d' }}
        >
          <Text className="text-lg font-bold text-white">+</Text>
        </View>
      </View>
    </Pressable>
  );
}
