// components/inventory/BulkStockEntryRow.tsx
import { View, Text } from 'react-native';
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
                ? Colors.tertiaryFixed
                : Colors.errorContainer,
          }}
        >
          <Text
            className="text-xs font-medium uppercase"
            style={{
              color:
                product.status === 'High Demand'
                  ? Colors.onTertiaryFixed
                  : Colors.onErrorContainer,
            }}
          >
            {product.status}
          </Text>
        </View>
      )}
    </View>
  );
}