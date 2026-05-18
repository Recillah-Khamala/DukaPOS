import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

export type RevenueChartProps = {
  data: { date: string; revenue: number }[];
};

const PRIMARY = '#012d1d';

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const barWidth = 28;
  const spacing = 12;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height: 200 }]}> 
        <Text style={styles.emptyText}>No sales yet</Text>
      </View>
    );
  }

  const chartData = data.map((d) => ({ value: d.revenue, label: formatDay(d.date), frontColor: PRIMARY }));

  return (
    <View style={{ height: 200, width: '100%' }}>
      <BarChart
        data={chartData}
        barWidth={barWidth}
        spacing={spacing}
        initialSpacing={6}
        isAnimated
        hideRules
        yAxisThickness={0}
        xAxisColor="transparent"
        noOfSections={4}
        roundedTop
        barBorderRadius={4}
        showVerticalLines={false}
      />

      <View style={[styles.labelsRow, { paddingHorizontal: 8 }]}>
        {chartData.map((d, i) => (
          <Text key={i} style={[styles.label, { width: barWidth + spacing }]}> 
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    color: '#374151',
  },
});
