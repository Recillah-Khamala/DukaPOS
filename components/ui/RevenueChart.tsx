import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

type DataPoint = { date: string; revenue: number };

type Props = {
  data: DataPoint[];
};

const COLORS = {
  primary: '#012d1d',
};

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function RevenueChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>No sales yet</Text>
      </View>
    );
  }

  const chartData = data.map((d) => ({ value: d.revenue, label: formatDay(d.date), frontColor: COLORS.primary }));

  return (
    <View style={{ height: 200 }}>
      <BarChart
        data={chartData}
        barWidth={20}
        spacing={18}
        initialSpacing={0}
        isAnimated
        hideRules
        yAxisThickness={0}
        xAxisColor="transparent"
        noOfSections={4}
        roundedTop
        barCornerRadius={4}
        showVerticalLines={false}
        renderLabel={() => null}
        renderTooltip={() => null}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 8 }}>
        {data.map((d) => (
          <Text key={d.date} style={{ width: 40, textAlign: 'center', fontSize: 12, color: '#374151' }}>
            {formatDay(d.date)}
          </Text>
        ))}
      </View>
    </View>
  );
}
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
