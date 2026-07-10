import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Card from './Card';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  name: string;
  balance: number;
  lastUpdated?: string;
  categoryBalances?: Record<string, number>;
  isHighDebt?: boolean;
  onPress?: () => void;
};

const CustomerCard: React.FC<Props> = ({ name, balance, lastUpdated, categoryBalances, isHighDebt, onPress }) => {
  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 8 }} backgroundColor={isHighDebt ? '#fef2f2' : undefined} borderColor={isHighDebt ? Colors.error : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isHighDebt ? Colors.error : Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <MaterialIcons name="person" size={24} color={isHighDebt ? 'white' : Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 16, fontWeight: '600' }}>{name}</Text>
            {formattedDate && <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>Last update: {formattedDate}</Text>}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: isHighDebt ? Colors.error : Colors.onSurface, fontSize: 20, fontWeight: '800' }}>KES {balance.toLocaleString()}</Text>
            <Text style={{ color: isHighDebt ? Colors.error : Colors.onSurface, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>{isHighDebt ? 'High Debt' : 'Standard'}</Text>
          </View>
        </View>

        {categoryBalances && Object.keys(categoryBalances).length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {Object.entries(categoryBalances).map(([cat, amount]) => (
              <View key={cat} style={{ backgroundColor: Colors.secondaryContainer, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 }}>
                <Text style={{ color: Colors.onSecondaryContainer, fontSize: 11, fontWeight: '600' }}>{cat}: KES {amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default CustomerCard;
