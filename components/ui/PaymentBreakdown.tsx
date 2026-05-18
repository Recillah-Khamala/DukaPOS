import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Breakdown = { cash: number; mpesa: number };
type Counts = { cash?: number; mpesa?: number };

type Props = {
  breakdown: Breakdown;
  counts?: Counts;
};

export default function PaymentBreakdown({ breakdown, counts }: Props) {
  const cash = breakdown?.cash ?? 0;
  const mpesa = breakdown?.mpesa ?? 0;
  const total = cash + mpesa;

  const cashPct = total > 0 ? Math.round((cash / total) * 100) : 0;
  const mpesaPct = total > 0 ? Math.round((mpesa / total) * 100) : 0;

  return (
    <View className="space-y-3">
      {/* Cash Row */}
      <View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <MaterialIcons name="attach-money" size={18} color="#012d1d" />
            </View>
            <View>
              <Text className="text-sm font-medium text-neutral-900">Cash</Text>
              <Text className="text-xs text-neutral-500">{counts?.cash ?? 0} transactions</Text>
            </View>
          </View>

          <Text className="text-sm font-semibold text-neutral-900">{cashPct}%</Text>
        </View>

        <View className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <View style={[styles.progress, { width: `${cashPct}%`, backgroundColor: '#012d1d' }]} />
        </View>
      </View>

      {/* M-Pesa Row */}
      <View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-3">
              <MaterialIcons name="phone-android" size={18} color="#683b00" />
            </View>
            <View>
              <Text className="text-sm font-medium text-neutral-900">M-Pesa</Text>
              <Text className="text-xs text-neutral-500">{counts?.mpesa ?? 0} transactions</Text>
            </View>
          </View>

          <Text className="text-sm font-semibold text-neutral-900">{mpesaPct}%</Text>
        </View>

        <View className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <View style={[styles.progress, { width: `${mpesaPct}%`, backgroundColor: '#ffb702' }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    height: '100%',
    borderRadius: 8,
  },
});
