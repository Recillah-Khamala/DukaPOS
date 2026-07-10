import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Card from './Card';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  completedAt: string;
  itemsCount: number;
  total: number;
  paymentMethod: string;
  onPress?: () => void;
};

const TransactionCard: React.FC<Props> = ({ completedAt, itemsCount, total, paymentMethod, onPress }) => {
  const date = new Date(completedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = new Date(completedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginHorizontal: 16, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }}>{date}</Text>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>{time}</Text>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}>{itemsCount} item{itemsCount !== 1 ? 's' : ''}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>KES {total.toLocaleString()}</Text>
            <View style={{ backgroundColor: paymentMethod === 'mpesa' ? Colors.secondaryContainer : Colors.primaryFixed, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 10, fontWeight: '700' }}>{paymentMethod.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default TransactionCard;
