import React from 'react';
import { View, Text } from 'react-native';

export type Product = {
  name: string;
  unitsSold: number;
  revenue: number;
};

export type TopProductsListProps = {
  products: Product[];
};

export default function TopProductsList({ products }: TopProductsListProps) {
  if (!products || products.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-neutral-500">No sales data yet</Text>
      </View>
    );
  }

  const sorted = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topRevenue = Math.max(...sorted.map((p) => p.revenue), 1);

  return (
    <View className="w-full">
      {sorted.map((p, idx) => {
        const rank = idx + 1;
        const pct = p.revenue / topRevenue;
        return (
          <View key={p.name} className="py-2">
            <View className="flex-row items-center">
              <Text className="w-7 text-center text-neutral-700 font-semibold">{rank}</Text>

              <View className="flex-1 px-2">
                <Text className="text-sm text-neutral-900 font-medium" numberOfLines={1} ellipsizeMode="tail">
                  {p.name}
                </Text>
                <Text className="text-xs text-neutral-500">{p.unitsSold} units</Text>
              </View>

              <Text className="text-sm font-bold text-[#012d1d]">KES {p.revenue.toLocaleString()}</Text>
            </View>

            <View className="h-1.5 bg-gray-200 rounded mt-2 overflow-hidden">
              <View className="bg-[#ffb702] h-full" style={{ width: `${Math.round(pct * 100)}%` }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
