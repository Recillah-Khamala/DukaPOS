import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditItemCategory } from '../../hooks/useCreditLedger';
import Colors from '../../constants/colors';

interface CategoryPickerProps {
  selected: CreditItemCategory;
  onSelect: (category: CreditItemCategory) => void;
}

export const CATEGORY_OPTIONS: { label: string; value: CreditItemCategory }[] = [
  { label: 'Cereal', value: 'cereal' },
  { label: 'Milling', value: 'milling' },
  { label: 'Bags', value: 'bags' },
  { label: 'Other', value: 'other' },
];

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <>
      <Text style={{
        color: Colors.onSurfaceVariant,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
      }}>
        Category
      </Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 14,
      }}>
        {CATEGORY_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: selected === option.value ? Colors.primary : Colors.secondaryContainer,
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{
              color: selected === option.value ? '#fff' : Colors.onSecondaryContainer,
              fontSize: 13,
              fontWeight: selected === option.value ? '700' : '500',
            }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default CategoryPicker;