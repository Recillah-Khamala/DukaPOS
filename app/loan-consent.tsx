import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import TopAppBar from '../components/layout/TopAppBar';
import Colors from '../constants/colors';

const LoanConsentScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface }}>
      <TopAppBar title="Loan Consent" onBack={() => router.back()} />
      <View style={{ padding: 16 }}>
        {/* Data Sharing Consent Section */}
        <View style={{
          backgroundColor: Colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: Colors.outlineVariant,
          marginBottom: 16,
        }}>
          {/* Section header row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MaterialIcons name="security" size={24} color={Colors.primary} />
            <Text style={{ color: Colors.onSurface, fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
              Data Sharing Consent
            </Text>
          </View>

          {/* Label */}
          <Text style={{ color: Colors.onSurfaceVariant, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 8 }}>
            INFORMATION TO BE SHARED:
          </Text>

          {/* Consent items */}
          <View>
            {/* Item 1: Monthly Revenue */}
            <View style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ backgroundColor: Colors.primaryFixed, borderRadius: 20, padding: 8, marginRight: 12 }}>
                <MaterialIcons name="payments" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '700' }}>
                  Monthly Revenue
                </Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginTop: 2 }}>
                  A summary of your earnings for the last 6 months
                </Text>
              </View>
            </View>

            {/* Item 2: Inventory Value */}
            <View style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ backgroundColor: Colors.primaryFixed, borderRadius: 20, padding: 8, marginRight: 12 }}>
                <MaterialIcons name="inventory-2" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '700' }}>
                  Inventory Value
                </Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginTop: 2 }}>
                  Current stock levels and estimated total valuation
                </Text>
              </View>
            </View>

            {/* Item 3: Transaction History */}
            <View style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ backgroundColor: Colors.primaryFixed, borderRadius: 20, padding: 8, marginRight: 12 }}>
                <MaterialIcons name="receipt-long" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '700' }}>
                  Transaction History
                </Text>
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, marginTop: 2 }}>
                  Anonymized logs of daily sales and supply purchases
                </Text>
              </View>
            </View>
          </View>

          {/* Info chip */}
          <View style={{ backgroundColor: Colors.secondaryContainer, borderRadius: 8, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <MaterialIcons name="info" size={18} color={Colors.onSecondaryContainer} />
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '600' }}>
              This sharing is one-time and valid for 30 days.
            </Text>
          </Vile>
        </View>
      </View>
    </View>
  );
};

export default LoanConsentScreen;