import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import type { CreditItemCategory } from '../../hooks/useCreditLedger';

const CATEGORY_OPTIONS: { label: string; value: CreditItemCategory }[] = [
  { label: 'Cereal', value: 'cereal' },
  { label: 'Milling', value: 'milling' },
  { label: 'Bags', value: 'bags' },
  { label: 'Other', value: 'other' },
];

type CategoryPickerProps = {
  selected: CreditItemCategory;
  onSelect: (value: CreditItemCategory) => void;
};

export const CategoryPicker = ({ selected, onSelect }: CategoryPickerProps) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {CATEGORY_OPTIONS.map(opt => {
        const isSelected = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isSelected ? Colors.primary : Colors.secondaryContainer,
            }}
          >
            <Text
              style={{
                color: isSelected ? '#fff' : Colors.onSecondaryContainer,
                fontSize: 13,
                fontWeight: isSelected ? '700' : '500',
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};