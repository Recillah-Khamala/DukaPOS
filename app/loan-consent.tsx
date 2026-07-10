import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import TopAppBar from '../components/layout/TopAppBar';
import Card from '../components/ui/Card';
import Colors from '../constants/colors';

const LoanConsentScreen: React.FC = () => {
  const router = useRouter();

  const handleAuthorize = () => {
    Alert.alert(
      'Data Shared Successfully',
      'Your data has been shared. The lender will contact you within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.surface }}>
      <TopAppBar title="Loan Consent" onBack={() => router.back()} />
      <View style={{ padding: 16 }}>
        {/* Data Sharing Consent Section */}
        <Card
          backgroundColor={Colors.surface}
          style={{
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.outlineVariant,
            marginBottom: 16,
          }}
        >
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
            <Card style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
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
            </Card>

            {/* Item 2: Inventory Value */}
            <Card style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
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
            </Card>

            {/* Item 3: Transaction History */}
            <Card style={{ backgroundColor: Colors.surfaceContainerLowest, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
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
            </Card>
          </View>

          {/* Info chip */}
          <View style={{ backgroundColor: Colors.secondaryContainer, borderRadius: 8, padding: 10, flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <MaterialIcons name="info" size={18} color={Colors.onSecondaryContainer} style={{ marginRight: 8 }} />
            <Text style={{ color: Colors.onSecondaryContainer, fontSize: 13, fontWeight: '600' }}>
              This sharing is one-time and valid for 30 days.
            </Text>
          </View>
        </Card>

        {/* Action buttons */}
        <View>
          {/* Authorize Sharing */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 12,
            }}
            onPress={handleAuthorize}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              Authorize Sharing
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.surfaceContainerHigh,
              borderRadius: 12,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 18, fontWeight: '600' }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoanConsentScreen;