import { Text, View, Pressable } from 'react-native';

export type BasketPreviewBarProps = {
  itemCount: number;
  total: number;
  onPress: () => void;
};

export default function BasketPreviewBar({ itemCount, total, onPress }: BasketPreviewBarProps) {
  return (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-between px-4 bg-white shadow-lg shadow-black/8"
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        borderRadius: 16,
        marginHorizontal: 12,
        bottom: 132,
      }}
    >
      {/* Item count */}
      <Text className="text-sm text-neutral-500">
        {itemCount} item{itemCount !== 1 ? 's' : ''}
      </Text>

      {/* Total */}
      <Text className="text-xl font-bold text-neutral-900">
        KES {total.toLocaleString()}
      </Text>

      {/* CTA button */}
      <Pressable
        onPress={onPress}
        className="px-4 py-2 rounded-full items-center justify-center"
        style={{ backgroundColor: '#ffb702' }}
      >
        <Text className="text-sm font-semibold text-neutral-900">Go to Checkout →</Text>
      </Pressable>
    </View>
  );
}
