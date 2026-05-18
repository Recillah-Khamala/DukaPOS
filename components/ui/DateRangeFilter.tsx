import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import type { DateRange } from '../../hooks/useDateFilter';

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
};

const OPTIONS: { key: DateRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'all_time', label: 'All Time' },
];

export default function DateRangeFilter({ value, onChange, className }: Props) {
  return (
    <View className={className ?? ''}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
        {OPTIONS.map((opt) => {
          const active = opt.key === value;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              className={`px-4 py-2 mr-3 rounded-full items-center justify-center ${
                active ? 'bg-[#012d1d]' : 'bg-gray-100'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text className={`${active ? 'text-white' : 'text-neutral-700'} text-sm font-medium`}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
