// components/inventory/BulkStockEntryRow.tsx
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Card from '../ui/Card';
import Colors from '../../constants/colors';

export interface BulkStockEntryRowProps {
  product: {
    id: string;
    name: string;
    currentStock: number;
    icon?: string;
    status?: 'High Demand' | 'Low Stock';
    sellingUnit: string;
    buyingUnit: string;
  };
  deliveryAmount: number;
  onDeliveryAmountChange: (value: number) => void;
}

export default function BulkStockEntryRow({ product, deliveryAmount, onDeliveryAmountChange }: BulkStockEntryRowProps) {
  const handleDecrement = () => {
    if (deliveryAmount <= 0) return;
    onDeliveryAmountChange(deliveryAmount - 1);
  };

  const handleIncrement = () => {
    onDeliveryAmountChange(deliveryAmount + 1);
  };

  return (
    <Card
      style={{
        opacity: deliveryAmount === 0 ? 0.5 : 1,
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* ROW 1: icon + name/stock + status badge */}
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-4"
          style={{ flexShrink: 0 }}
        >
          <MaterialIcons name={(product.icon as any) || 'grain'} size={24} color="white" />
        </View>

        {/* FIX: minWidth: 0 lets a flex-1 text box actually shrink to fit
            instead of collapsing to ~0 and wrapping char-by-char */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text className="font-medium text-onSurface" numberOfLines={1}>
            {product.name}
          </Text>
          <Text className="text-sm text-onSurfaceVariant" numberOfLines={1}>
            Current Stock: {product.currentStock} {product.sellingUnit}
          </Text>
        </View>

        {product.status && (
          <View
            className="px-3 py-1 rounded-md ml-2"
            style={{
              flexShrink: 0,
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
      </View>

      {/* ROW 2: stepper controls + "Adding in" label */}
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleDecrement}
            disabled={deliveryAmount <= 0}
            className="px-2 py-1 rounded-md"
            style={{ backgroundColor: deliveryAmount <= 0 ? '#d1d5db' : Colors.secondaryContainer, marginRight: 8 }}
          >
            <MaterialIcons name="remove" size={20} color={deliveryAmount <= 0 ? '#9ca3af' : 'white'} />
          </TouchableOpacity>
          <TextInput
            value={deliveryAmount.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text) || 0;
              onDeliveryAmountChange(num);
            }}
            keyboardType="decimal-pad"
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

        <Text className="text-xs text-onSurfaceVariant" numberOfLines={1}>
          Adding in: {product.buyingUnit}
        </Text>
      </View>
    </View>
  );
}