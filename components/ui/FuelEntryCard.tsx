import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type FuelEntryCardProps = {
  fuelType: 'diesel' | 'electricity';
  date: string;
  quantity: number;
  costPerUnit: number;
  totalCost: number;
  note?: string;
};

const FuelEntryCard: React.FC<FuelEntryCardProps> = ({ fuelType, date, quantity, costPerUnit, totalCost, note }) => {
  return (
    <Card style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: fuelType === 'diesel' ? Colors.secondaryContainer : Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <MaterialIcons name={fuelType === 'diesel' ? 'local-gas-station' : 'bolt'} size={22} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }}>
          {fuelType === 'diesel' ? 'Diesel' : 'Electricity'}
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
          {new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
          {quantity} {fuelType === 'diesel' ? 'L' : 'kWh'} @ KES {costPerUnit}/unit
        </Text>
        {note ? (
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontStyle: 'italic', marginTop: 2 }}>{note}</Text>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: Colors.error, fontSize: 16, fontWeight: '700' }}>KES {totalCost.toLocaleString()}</Text>
        <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11 }}>fuel cost</Text>
      </View>
    </Card>
  );
};

export default FuelEntryCard;
