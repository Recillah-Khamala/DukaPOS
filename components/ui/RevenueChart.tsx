import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

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

  // Format date to day of week (Mon, Tue, etc.)
  const chartData = data.map(({ date, revenue }) => {
    const day = new Date(date).toLocaleDateString(undefined, { weekday: 'short' });
    return { label: day, value: revenue };
  });

  return (
    <View className="w-full">
      <BarChart
        data={chartData}
        width={undefined} // Take full width
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // revenue values
          color: (opacity: number) => `rgba(1, 45, 29, ${opacity})`, // primary green #012d1d
          labelColor: (opacity: number) => `rgba(1, 45, 29, ${opacity})`,
          style: { borderRadius: 8 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fff',
          },
        }}
        bezier
        style={{ borderRadius: 8 }}
        // Add a bit of padding to the chart
        contentInset={{ top: 20, bottom: 30, left: 20, right: 20 }}
      />
    </View>
  );
}