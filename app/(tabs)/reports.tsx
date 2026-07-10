import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import BusinessHealthTab from '../../components/reports/BusinessHealthTab';
import MarketInsightsTab from '../../components/reports/MarketInsightsTab';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = React.useState<'Business Health' | 'Market Insights'>('Business Health');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);
  const { sales } = useSalesHistory();

  return (
    <View className="flex-1">
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: Colors.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="assessment" size={24} color="white" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <MaterialIcons name="notifications-none" size={24} color="white" />
      </View>

      {/* Tab Row */}
      <View style={{ flexDirection: 'row', height: 44 }}>
        {(['Business Health', 'Market Insights'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[activeTab === tab ? { backgroundColor: Colors.secondaryContainer } : {}, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ color: activeTab === tab ? Colors.onSecondaryContainer : Colors.onSurfaceVariant, fontWeight: activeTab === tab ? '600' : '400', fontSize: 12 }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

{/* Tab Content */}
  <View className="flex-1">
          {activeTab === 'Business Health' && <BusinessHealthTab sales={sales} bottomNavHeight={bottomNavHeight} />}
          {activeTab === 'Market Insights' && <MarketInsightsTab bottomNavHeight={bottomNavHeight} />}
        </View>

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}