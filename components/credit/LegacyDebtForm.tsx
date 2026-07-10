import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CreditItemCategory } from '../../hooks/useCreditLedger';
import FormField from './FormField';
import CategoryPicker from './CategoryPicker';
import Colors from '../../constants/colors';

interface LegacyDebtFormProps {
  description: string;
  onDescriptionChange: (text: string) => void;
  category: CreditItemCategory;
  onCategoryChange: (category: CreditItemCategory) => void;
  total: string;
  onTotalChange: (text: string) => void;
  alreadyPaid: string;
  onAlreadyPaidChange: (text: string) => void;
  day: string;
  onDayChange: (text: string) => void;
  month: string;
  onMonthChange: (text: string) => void;
  year: string;
  onYearChange: (text: string) => void;
}

const LegacyDebtForm: React.FC<LegacyDebtFormProps> = ({
  description,
  onDescriptionChange,
  category,
  onCategoryChange,
  total,
  onTotalChange,
  alreadyPaid,
  onAlreadyPaidChange,
  day,
  onDayChange,
  month,
  onMonthChange,
  year,
  onYearChange,
}) => {
  return (
    <>
      {/* Description */}
      <FormField
        label="Description (optional)"
        placeholder="e.g. Old balance from before the app"
        value={description}
        onChangeText={onDescriptionChange}
      />

      {/* Category */}
      <Text style={{
        fontSize: 13,
        fontWeight: '600',
        color: Colors.onSurfaceVariant,
        marginBottom: 6,
      }}>
        Category (if known)
      </Text>
      <CategoryPicker
        selected={category}
        onSelect={onCategoryChange}
      />

      {/* Total Amount Owed */}
      <FormField
        label="Total Amount Owed (KES)"
        keyboardType="numeric"
        placeholder="e.g. 400"
        value={total}
        onChangeText={onTotalChange}
      />

      {/* Amount Already Paid */}
      <FormField
        label="Amount Already Paid (optional)"
        keyboardType="numeric"
        placeholder="e.g. 0"
        value={alreadyPaid}
        onChangeText={onAlreadyPaidChange}
      />

      {/* Debt Started On */}
      <Text style={{
        fontSize: 13,
        fontWeight: '600',
        color: Colors.onSurfaceVariant,
        marginBottom: 6,
      }}>
        Debt Started On (approximate is fine)
      </Text>
      <View style={{
        flexDirection: 'row',
        marginBottom: 8,
      }}>
        <TextInput
          placeholder="DD"
          maxLength={2}
          keyboardType="numeric"
          textAlign="center"
          value={day}
          onChangeText={onDayChange}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            flex: 1,
            marginRight: 8,
          }}
        />
        <TextInput
          placeholder="MM"
          maxLength={2}
          keyboardType="numeric"
          textAlign="center"
          value={month}
          onChangeText={onMonthChange}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            flex: 1,
            marginRight: 8,
          }}
        />
        <TextInput
          placeholder="YYYY"
          maxLength={4}
          keyboardType="numeric"
          textAlign="center"
          value={year}
          onChangeText={onYearChange}
          style={{
            borderWidth: 1.5,
            borderColor: Colors.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: Colors.onSurface,
            flex: 1.5,
          }}
        />
      </View>

      {/* Caption */}
      <Text style={{
        fontSize: 12,
        color: Colors.onSurfaceVariant,
        marginBottom: 20,
      }}>
        Leave blank to use today's date. This affects which debts get paid off first when the customer makes a payment.
      </Text>
    </>
  );
};

export default LegacyDebtForm;