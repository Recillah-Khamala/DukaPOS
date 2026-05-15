import { TouchableOpacity, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { PaymentMethod } from '../../types';

export type PaymentMethodSelectorProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <View className="flex-row gap-4">
      {/* Cash Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onChange('cash')}
        className={`flex-1 items-center justify-center py-3 rounded-lg border-2 ${
          value === 'cash'
            ? 'bg-green-50 dark:bg-green-900/30 border-green-800 dark:border-green-200'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
        }`}
      >
        <MaterialIcons name="attach_money" size={24} color="#012d1d" />
        <Text className="mt-1 text-sm font-medium">
          Cash
        </Text>
      </TouchableOpacity>

      {/* M-Pesa Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onChange('mpesa')}
        className={`flex-1 items-center justify-center py-3 rounded-lg border-2 ${
          value === 'mpesa'
            ? 'bg-green-50 dark:bg-green-900/30 border-green-800 dark:border-green-200'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
        }`}
      >
        <MaterialIcons name="phone_android" size={24} color="#012d1d" />
        <Text className="mt-1 text-sm font-medium">
          M-Pesa
        </Text>
      </TouchableOpacity>
    </View>
  );
}