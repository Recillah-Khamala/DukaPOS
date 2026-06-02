import { Text, View, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomNavBar from '../components/layout/BottomNavBar';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: '#012d1d' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialIcons name="storefront" size={24} color="white" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialIcons name="search" size={24} color="white" />
            <MaterialIcons name="notifications-none" size={24} color="white" />
          </View>
        </View>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 180 }}>
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#404844', marginTop: 16 }}>Welcome to DukaPOS</Text>
          <Text style={{ fontSize: 14, color: '#717973', marginTop: 8 }}>Navigate using the bottom tabs</Text>
        </ScrollView>
      </View>
      <BottomNavBar activeTab="sales" />
    </View>
  );
}