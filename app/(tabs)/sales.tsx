import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES } from '../../constants/salesData';

export default function SalesScreen() {
  const router = useRouter();
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const { items, total, addItem } = useSharedBasket();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: items.length > 0 ? 320 : 180 }}
      >
        <View className="mt-[16px] px-[16px]">
          <View className="flex-row justify-between items-center mb-[8px]">
            <Text className="text-[20px] font-semibold text-primary">Cereal Sales</Text>
            <View className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold text-[14px]">
              <Text>Unit: KG</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-[12px]">
            {CEREAL_PRODUCTS.map((product) => {
              const isFlashing = flashingId === product.id;
              const handlePress = () => {
                addItem({
                  id: `${product.id}_${Date.now()}`,
                  productId: product.id,
                  name: product.name,
                  qty: 1,
                  unitPrice: product.pricePerKg,
                  type: 'cereal',
                });
                setFlashingId(product.id);
                setTimeout(() => setFlashingId(null), 300);
              };
              return (
                <Pressable
                  key={product.id}
                  onPress={handlePress}
                  className={`w-[48%] bg-surface-container-lowest rounded-xl p-[16px] border-2 active:scale-95 ${isFlashing ? 'border-secondary' : 'border-transparent'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                  }}
                >
                  <View className="w-[48px] h-[48px] bg-primary-fixed rounded-lg mb-[8px] items-center justify-center">
                    <MaterialIcons name={product.icon.replace('_', '-') as any} size={32} color={Colors.primary} />
                  </View>
                  <Text className="font-bold text-[14px] text-on-surface-variant">{product.name}</Text>
                  <Text className="text-[28px] font-extrabold text-primary">{product.pricePerKg} <Text className="font-bold text-[14px] text-primary">KES</Text></Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <Pressable
          className="mt-4 mx-[16px] w-full items-center justify-center rounded-xl border-2 border-dashed py-4"
          style={{ borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerHigh, height: 56 }}
        >
          <Text className="text-base font-semibold" style={{ color: Colors.outline }}>+ Add Custom Item</Text>
        </Pressable>

        <View className="px-[16px] mt-[8px]">
          <Text className="text-[20px] font-semibold text-primary mb-[8px]">Poshomill Services</Text>
          <View className="flex-col gap-[8px]">
            {POSHOMILL_SERVICES.map((service) => {
              const isFlashing = flashingId === service.id;
              const handlePress = () => {
                addItem({
                  id: `${service.id}_${Date.now()}`,
                  productId: service.id,
                  name: service.name,
                  qty: 1,
                  unitPrice: service.pricePerKg,
                  type: 'service',
                });
                setFlashingId(service.id);
                setTimeout(() => setFlashingId(null), 300);
              };
              return (
                <Pressable
                  key={service.id}
                  onPress={handlePress}
                  className={`flex-row items-center justify-between bg-surface-container-lowest rounded-xl p-[16px] border-l-[4px] active:scale-95 ${isFlashing ? 'border-secondary' : 'border-secondary'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center gap-[16px]">
                    <MaterialIcons name={service.icon.replace('_', '-') as any} size={28} color={Colors.secondary} />
                    <View>
                      <Text className="font-bold text-[16px] text-on-surface">{service.name}</Text>
                      <Text className="font-bold text-[14px] text-on-surface-variant">Per KG</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-[16px]">
                    <Text className="text-[20px] font-semibold text-primary">{service.pricePerKg} KES</Text>
                    <Pressable
                      onPress={handlePress}
                      className="w-[48px] h-[48px] bg-secondary-container text-on-secondary-container rounded-full items-center justify-center active:scale-90"
                    >
                      <MaterialIcons name="add" size={24} color={Colors.onSecondaryContainer} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {items.length > 0 && (
        <View
          className="flex-row items-center justify-between px-4"
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: Colors.outlineVariant,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View>
            <Text className="text-xs font-semibold uppercase" style={{ color: Colors.onSurfaceVariant }}>Total Due</Text>
            <Text className="text-[28px] font-extrabold" style={{ color: Colors.secondary }}>
              {total.toLocaleString()} <Text className="text-xs font-medium">KES</Text>
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/checkout')}
            className="flex-row items-center justify-center rounded-xl px-6"
            style={{ backgroundColor: Colors.primary, height: 56, flexGrow: 1, marginLeft: 16 }}
          >
            <MaterialIcons name="check-circle" size={20} color="white" />
            <Text className="ml-2 text-base font-semibold text-white">Confirm Sale</Text>
          </Pressable>
        </View>
      )}

      <BottomNavBar activeTab="sales" />
    </View>
  );
}
