// components/inventory/BulkStockEntryRow.tsx
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

export interface BulkStockEntryRowProps {
  product: {
    id: string;
    name: string;
    currentStock: number;
    icon?: string;
    status?: 'High Demand' | 'Low Stock';
  };
}

export default function BulkStockEntryRow({ product }: BulkStockEntryRowProps) {
  const [deliveryAmount, setDeliveryAmount] = useState(0);

  useEffect(() => {
    console.log('Delivery amount:', deliveryAmount);
  }, [deliveryAmount]);

  const handleIncrement = () => setDeliveryAmount(deliveryAmount + 1);
  const handleDecrement = () => setDeliveryAmount(Math.max(0, deliveryAmount - 1));

  return (
    <View className="flex-row items-center py-4 px-6 bg-white rounded-lg shadow-sm mb-3">
      <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4">
        <MaterialIcons name={(product.icon as any) || 'grain'} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-onSurface">{product.name}</Text>
        <Text className="text-sm text-onSurfaceVariant">
          Current Stock: {product.currentStock} units
        </Text>
      </View>
      {product.status && (
        <View
          className="px-3 py-1 rounded-md"
          style={{
            backgroundColor:
              product.status === 'High Demand'
                ? Colors.secondaryContainer
                : Colors.error,
          }}
        >
          <Text
            className="text-xs font-medium uppercase"
            style={{
              color:
                product.status === 'High Demand'
                  ? Colors.onSecondaryContainer
                  : Colors.white,
            }}
          >
            {product.status}
          </Text>
        </View>
      )}
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          onPress={handleDecrement}
          className="px-2 py-1 rounded-md"
          style={{ backgroundColor: Colors.secondaryContainer }}
        >
          <MaterialIcons name="remove" size={20} color="white" />
        </TouchableOpacity>
        <TextInput
          value={deliveryAmount.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 0;
            setDeliveryAmount(num);
          }}
          keyboardType="numeric"
          className="w-16 border border-gray-300 rounded-md px-2 text-center"
          style={{ textAlign: 'center' }}
        />
        <TouchableOpacity
          onPress={handleIncrement}
          className="px-2 py-1 rounded-md"
          style={{ backgroundColor: Colors.secondaryContainer }}
        >
          <MaterialIcons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}