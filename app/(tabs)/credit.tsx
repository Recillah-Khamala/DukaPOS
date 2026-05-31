import { Text, View, ScrollView } from 'react-native';
import BottomNavBar from '../../components/layout/BottomNavBar';

export default function CreditShell() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 180 }}>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#404844', marginTop: 16 }}>Credit coming soon</Text>
        </ScrollView>
      </View>
      <BottomNavBar activeTab="credit" />
    </View>
  );
}
