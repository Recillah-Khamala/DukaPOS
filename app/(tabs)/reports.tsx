import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';

export default function ReportsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'Business Health' | 'Market Insights'>('Business Health');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 12,
        backgroundColor: Colors.primary,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <MaterialIcons name="assessment" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <MaterialIcons name="notifications-none" size={24} color="white" />
      </View>

      <View style={{ flexDirection: 'row', height: 44 }}>
        <TouchableOpacity
          style={[
            activeTab === 'Business Health' ? { backgroundColor: Colors.secondaryContainer } : {},
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
          onPress={() => setActiveTab('Business Health')}
        >
          <Text style={{ 
            color: activeTab === 'Business Health' ? Colors.onSecondaryContainer : Colors.onSurfaceVariant,
            fontWeight: activeTab === 'Business Health' ? '600' : '400',
          }}>
            Business Health
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            activeTab === 'Market Insights' ? { backgroundColor: Colors.secondaryContainer } : {},
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
          onPress={() => setActiveTab('Market Insights')}
        >
          <Text style={{ 
            color: activeTab === 'Market Insights' ? Colors.onSecondaryContainer : Colors.onSurfaceVariant,
            fontWeight: activeTab === 'Market Insights' ? '600' : '400',
          }}>
            Market Insights
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottomNavHeight + 24 }}
      >
        {activeTab === 'Business Health' ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Business Health coming soon</Text>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Market Insights coming soon</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="reports" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}