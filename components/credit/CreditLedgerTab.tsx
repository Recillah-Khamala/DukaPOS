import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Colors } from '../theme/Colors';

const CreditLedgerTab: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Text style={{ color: Colors.onSurfaceVariant }}>
        Credit Ledger coming soon
      </Text>
    </ScrollView>
  );
};

export default CreditLedgerTab;