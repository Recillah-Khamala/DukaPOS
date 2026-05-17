// simple, type-safe revenue chart replacement
import React from 'react';
import { View, Text, Dimensions } from 'react-native';

export type RevenueChartProps = {
  data: { date: string; revenue: number }[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-neutral-500">No sales yet</Text>
      </View>
    );
  }

  const chartData = data.map(({ date, revenue }) => {
    const day = new Date(date).toLocaleDateString(undefined, { weekday: 'short' });
    return { label: day, value: revenue };
  });

  const max = Math.max(...chartData.map((d) => d.value), 1);
  const barMaxWidth = Math.min(Math.max(Dimensions.get('window').width - 96, 240), 600);

  return (
    <View className="w-full">
      <View className="bg-white rounded-lg p-3">
        {chartData.map((d) => (
          <View key={d.label} className="flex-row items-center mb-2">
            <Text className="w-16 text-sm text-neutral-600">{d.label}</Text>
            <View className="h-4 rounded bg-emerald-300 mr-3" style={{ width: (d.value / max) * barMaxWidth }} />
            <Text className="text-sm text-neutral-800">KES {d.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
