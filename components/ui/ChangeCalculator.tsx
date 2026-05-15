import { Text, View, TextInput } from 'react-native';

export type ChangeCalculatorProps = {
  totalBill: number;
  cashReceived: number;
  onCashReceivedChange: (amount: number) => void;
};

export default function ChangeCalculator({ totalBill, cashReceived, onCashReceivedChange }: ChangeCalculatorProps) {
  const change = Math.max(0, cashReceived - totalBill);

  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      {/* Total Bill */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-neutral-600">
          Total Bill
        </Text>
        <Text className="mt-1 text-2xl font-bold text-neutral-900">
          KES {totalBill.toLocaleString()}
        </Text>
      </View>

      {/* Cash Received Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-neutral-600">
          Cash Received
        </Text>
        <TextInput
          className="mt-1 w-full p-3 text-xl font-bold text-neutral-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="0"
          placeholderTextColor="gray-400"
          keyboardType="numeric"
          value={cashReceived.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 0;
            onCashReceivedChange(num);
          }}
        />
      </View>

      {/* Change Due */}
      <View className="text-center">
        <Text className="text-sm font-medium text-neutral-600">
          Change Due
        </Text>
        <Text className="mt-1 text-2xl font-bold text-amber-600">
          KES {change.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}