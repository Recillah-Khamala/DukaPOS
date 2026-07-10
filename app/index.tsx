import { Text, View, ScrollView } from 'react-native';
import TopAppBar from '../components/layout/TopAppBar';
import BottomNavBar from '../components/layout/BottomNavBar';

export default function Index() {
  return (
    <View className="flex-1" style={{ backgroundColor: '#f9fafb' }}>
      <TopAppBar title="Kijiji Cereal Store" />
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 180 }}>
        <Text style={{ fontSize: 18, fontWeight: '500', color: '#404844', marginTop: 16 }}>Welcome to DukaPOS</Text>
        <Text style={{ fontSize: 14, color: '#717973', marginTop: 8 }}>Navigate using the bottom tabs</Text>
      </ScrollView>
      <BottomNavBar activeTab="sales" />
    </View>
  );
}