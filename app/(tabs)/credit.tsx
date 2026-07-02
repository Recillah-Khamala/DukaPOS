import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import CreditOverviewTab from './../../components/credit/CreditOverviewTab';
import CreditDetailsTab from './../../components/credit/CreditDetailsTab';

export default function CreditScreen() {
  const [activeTab, setActiveTab] = React.useState<'Overview' | 'Details'>('Overview');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);
  const sales: any[] = []; // Placeholder data

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: Colors.primary }}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
           <MaterialIcons name="account-balance" size={24} color="white" />
           <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Credit</Text>
         </View>
         <MaterialIcons name="notifications-none" size={24} color="white" />
       </View>

      {/* Tab Row */}
      <View style={{ flexDirection: 'row', height: 44 }}>
        {(['Overview', 'Details'] as const).map(tab => (
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
      <View style={{ flex: 1 }}>
        {activeTab === 'Overview' && <CreditOverviewTab sales={sales} />}
        {activeTab === 'Details' && <CreditDetailsTab sales={sales} />}
      </View>

      <BottomNavBar activeTab="credit" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}