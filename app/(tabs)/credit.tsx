import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Colors from '../../constants/colors';
import ShopLoansTab from '../../components/credit/ShopLoansTab';
import CreditLedgerTab from '../../components/credit/CreditLedgerTab';

export default function CreditScreen() {
  const [activeTab, setActiveTab] = React.useState<'Shop Loans' | 'Credit Ledger'>('Shop Loans');
  const [bottomNavHeight, setBottomNavHeight] = React.useState(0);
  const router = useRouter();

  return (
    <View className="flex-1">
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
        {(['Shop Loans', 'Credit Ledger'] as const).map(tab => (
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
        {activeTab === 'Shop Loans' && <ShopLoansTab bottomNavHeight={bottomNavHeight} />}
        {activeTab === 'Credit Ledger' && <CreditLedgerTab />}
      </View>

      <BottomNavBar activeTab="credit" onHeightMeasured={setBottomNavHeight} />

      {activeTab === 'Credit Ledger' && (
        <TouchableOpacity
          onPress={() => router.push('/new-credit-entry')}
          style={{
            position: 'absolute',
            bottom: bottomNavHeight + 16,
            right: 16,
            height: 48,
            paddingHorizontal: 20,
            borderRadius: 24,
            backgroundColor: Colors.secondaryContainer,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            elevation: 4,
            zIndex: 20,
            borderWidth: 2,
            borderColor: Colors.secondary,
          }}
        >
          <MaterialIcons name="add-circle" size={20} color={Colors.onSecondaryContainer} />
          <Text style={{ color: Colors.onSecondaryContainer, fontSize: 14, fontWeight: '700' }}>
            New Credit Entry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}