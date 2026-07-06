import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/colors';
import FormField from './FormField';
import CategoryPicker from './CategoryPicker';
import type { CreditItemCategory } from '../../hooks/useCreditLedger';

type LegacyDebtFormProps = {
  debtDescription: string;
  setDebtDescription: (text: string) => void;
  debtCategory: CreditItemCategory;
  setDebtCategory: (value: CreditItemCategory) => void;
  debtTotal: string;
  setDebtTotal: (text: string) => void;
  debtAlreadyPaid: string;
  setDebtAlreadyPaid: (text: string) => void;
  debtDay: string;
  setDebtDay: (text: string) => void;
  debtMonth: string;
  setDebtMonth: (text: string) => void;
  debtYear: string;
  setDebtYear: (text: string) => void;
};

export const LegacyDebtForm = ({
  debtDescription,
  setDebtDescription,
  debtCategory,
  setDebtCategory,
  debtTotal,
  setDebtTotal,
  debtAlreadyPaid,
  setDebtAlreadyPaid,
  debtDay,
  setDebtDay,
  debtMonth,
  setDebtMonth,
  debtYear,
  setDebtYear,
}: LegacyDebtFormProps) => {
  return (
    <>
      {/* Description */}
      <FormField
        label="Description (optional)"
        value={debtDescription}
        onChangeText={setDebtDescription}
        placeholder="e.g. Old balance from before the app"
      />

      {/* Category */}
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
        Category (if known)
      </Text>
      <CategoryPicker selected={debtCategory} onSelect={setDebtCategory} />

      {/* Total owed */}
      <FormField
        label="Total Amount Owed (KES)"
        value={debtTotal}
        onChangeText={setDebtTotal}
        placeholder="e.g. 400"
        keyboardType="numeric"
      />

      {/* Already paid */}
      <FormField
        label="Amount Already Paid (optional)"
        value={debtAlreadyPaid}
        onChangeText={setDebtAlreadyPaid}
        placeholder="e.g. 0"
        keyboardType="numeric"
      />

      {/* Debt origin date */}
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
        Debt Started On (approximate is fine)
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <FormField
          label="DD"
          value={debtDay}
          onChangeText={setDebtDay}
          placeholder="DD"
          keyboardType="numeric"
          maxLength={2}
          style={{ flex: 1 }}
        />
        <FormField
          label="MM"
          value={debtMonth}
          onChangeText={setDebtMonth}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
          style={{ flex: 1 }}
        />
        <FormField
          label="YYYY"
          value={debtYear}
          onChangeText={setDebtYear}
          placeholder="YYYY"
          keyboardType="numeric"
          maxLength={4}
          style={{ flex: 1.5 }}
        />
      </View>
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginBottom: 20 }}>
        Leave blank to use today's date. This affects which debts get paid off first when the customer makes a payment.
      </Text>
    </>
  );
};