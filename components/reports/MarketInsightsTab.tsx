import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

interface MarketInsightsTabProps {
  bottomNavHeight: number;
}

const MarketInsightsTab: React.FC<MarketInsightsTabProps> = ({ bottomNavHeight }) => {
  const demandItems = [
    { name: 'Maize', icon: 'grass', percent: 88, note: 'Kitale: +24% vs National' },
    { name: 'Millet', icon: 'eco', percent: 62, note: 'Kitale: +8% vs National' },
    { name: 'Sorghum', icon: 'grain', percent: 45, note: 'Kitale: -4% vs National' },
  ];

  const topShops = [
    { initials: 'WM', name: 'Wekesa Millers', tag: 'High Volume', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'KM', name: 'Kitale Maize Hub', tag: 'Steady Repayment', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'CP', name: 'Cherangani Posho', tag: 'Peak Season Growth', icon: 'star', iconColor: Colors.secondary },
  ];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: bottomNavHeight + 24 }}>

      <Text className="text-2xl font-bold mb-4" style={{ color: Colors.primary }}>
        Insights & Analytics
      </Text>

      {/* 4 Stat Cards */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        {[
          { label: 'Regional Avg Price', value: 'KES 128/kg', icon: 'trending-up', iconColor: '#16a34a' },
          { label: 'Active Traders', value: '142 Shops', icon: 'store', iconColor: Colors.primary },
          { label: 'Top Commodity', value: 'Maize', icon: 'grass', iconColor: Colors.secondary },
          { label: 'Market Demand', value: '+12% this week', icon: 'trending-up', iconColor: '#16a34a' },
        ].map((card) => (
          <View
            key={card.label}
            className="bg-white rounded-xl p-3 border border-outline-variant"
            style={{ width: '47%' }}
          >
            <MaterialIcons name={card.icon as any} size={24} color={card.iconColor} />
            <Text className="text-base font-bold mt-2" style={{ color: Colors.onSurface }}>{card.value}</Text>
            <Text className="text-xs mt-0.5" style={{ color: Colors.onSurfaceVariant }}>{card.label}</Text>
          </View>
        ))}
      </View>

      {/* Kitale Hub Activity */}
      <Text className="text-base font-semibold mb-2" style={{ color: Colors.primary }}>
        Kitale Hub Activity
      </Text>
      <Text className="text-xs mb-3" style={{ color: Colors.onSurfaceVariant }}>
        Heatmap based on Posho Mill throughput
      </Text>
      <View
        className="rounded-xl items-center justify-center mb-4"
        style={{ backgroundColor: Colors.surfaceContainerHigh, height: 160 }}
      >
        <MaterialIcons name="map" size={48} color={Colors.outlineVariant} />
        <Text className="text-sm mt-2" style={{ color: Colors.onSurfaceVariant }}>Live map coming soon</Text>
      </View>

      {/* Demand by Commodity */}
      <Text className="text-base font-semibold mb-3" style={{ color: Colors.primary }}>
        Demand by Commodity
      </Text>
      {demandItems.map((item) => (
        <View key={item.name} className="mb-4">
          <View className="flex-row justify-between items-center mb-1.5">
            <View className="flex-row items-center">
              <MaterialIcons name={item.icon as any} size={18} color={Colors.secondary} />
              <Text className="text-sm font-bold ml-1.5" style={{ color: Colors.onSurface }}>{item.name}</Text>
            </View>
            <Text className="text-xs" style={{ color: Colors.onSurfaceVariant }}>{item.note}</Text>
          </View>
          <View className="h-2 rounded-full" style={{ backgroundColor: Colors.surfaceContainerHigh }}>
            <View
              className="h-2 rounded-full"
              style={{ width: `${item.percent}%`, backgroundColor: Colors.primary }}
            />
          </View>
        </View>
      ))}

      {/* Top Shops */}
      <Text className="text-base font-semibold mb-3" style={{ color: Colors.primary }}>
        Top Shops in Kitale
      </Text>
      {topShops.map((shop) => (
        <View
          key={shop.name}
          className="flex-row items-center justify-between rounded-lg p-3 mb-2"
          style={{ backgroundColor: Colors.surface }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: Colors.primaryFixed }}
          >
            <Text className="text-sm font-bold" style={{ color: Colors.primary }}>{shop.initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold" style={{ color: Colors.onSurface }}>{shop.name}</Text>
            <Text className="text-xs" style={{ color: Colors.onSurfaceVariant }}>{shop.tag}</Text>
          </View>
          <MaterialIcons name={shop.icon as any} size={24} color={shop.iconColor} />
        </View>
      ))}

    </ScrollView>
  );
};

export default MarketInsightsTab;