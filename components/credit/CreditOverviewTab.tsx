import React from 'react';
import { View, Text } from 'react-native';

export default function CreditOverviewTab({ sales }: { sales: any[] }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Credit Overview Tab</Text>
    </View>
  );
}