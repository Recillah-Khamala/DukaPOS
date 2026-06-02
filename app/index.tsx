import { Text, View, ScrollView } from 'react-native';
import BottomNavBar from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Kijiji Cereal Store" />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 180 }}>
        <Text style={{ fontSize: 18, fontWeight: '500', color: '#404844', marginTop: 16 }}>Welcome to DukaPOS</Text>
        <Text style={{ fontSize: 14, color: '#717973', marginTop: 8 }}>Navigate using the bottom tabs</Text>
      </ScrollView>
    </View>
  );
}