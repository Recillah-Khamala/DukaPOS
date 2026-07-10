import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Card from './Card';

export type StatCardProps = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accentColor: string;
  trend?: string;
};

export default function StatCard({ label, value, icon, accentColor, trend }: StatCardProps) {
  const isPositive = trend ? trend.startsWith('+') : false;
  
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, marginBottom: 12, borderColor: 'transparent' }}>
      {/* Icon with accent color background */}
      <View className={`flex-shrink-0 p-3 rounded-lg ${accentColor}-100`}>
        <MaterialIcons name={icon} size={28} color={accentColor} />
      </View>
      
      {/* Text content */}
      <View className="flex-1">
        <Text className="text-sm font-medium text-neutral-500">{label}</Text>
        <Text className="mt-1 text-2xl font-bold text-neutral-900">{value}</Text>
        {trend && (
          <Text className={`mt-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </Text>
        )}
      </View>
    </Card>
  );
}