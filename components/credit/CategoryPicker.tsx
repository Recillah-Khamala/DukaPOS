import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import type { CreditItemCategory } from '../../hooks/useCreditLedger';

interface CategoryPickerProps {
  selected: CreditItemCategory;
  onSelect: (category: CreditItemCategory) => void;
}

const CATEGORY_OPTIONS: { label: string; value: CreditItemCategory }[] = [
  { label: 'Cereal', value: 'cereal' },
  { label: 'Milling', value: 'milling' },
  { label: 'Bags', value: 'bags' },
  { label: 'Other', value: 'other' },
];

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selected, onSelect }) => {
  return (
    <View>
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
        Category
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {CATEGORY_OPTIONS.map(option => {
          const isSelected = option.value === selected;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
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
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CategoryPicker;