import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';

type UnitToggle = 'kg' | 'korokoro';
type Fraction = 0 | 0.125 | 0.25 | 0.5 | 1;

const CEREAL_PRODUCTS = [
  { id: 'maize', name: 'Maize', icon: 'grass' as const, priceKes: 95 },
  { id: 'beans', name: 'Beans', icon: 'eco' as const, priceKes: 160 },
  { id: 'groundnuts', name: 'Groundnuts', icon: 'grain' as const, priceKes: 220 },
  { id: 'sorghum', name: 'Sorghum', icon: 'water_drop' as const, priceKes: 110 },
  { id: 'millet', name: 'Millet', icon: 'filter_vintage' as const, priceKes: 145 },
];

const POSHO_SERVICES = [
  { id: 'grade1', name: 'Grade 1 Milling', subtitle: 'Per KG', priceKes: 20 },
  { id: 'regular', name: 'Regular Milling', subtitle: 'Per KG', priceKes: 15 },
];

const FRACTIONS = [
  { val: 0.125 as Fraction, label: '1/8' },
  { val: 0.25 as Fraction, label: '1/4' },
  { val: 0.5 as Fraction, label: '1/2' },
  { val: 1 as Fraction, label: '1' },
];

function UnitTogglePill({ value, onChange }: { value: UnitToggle; onChange: (v: UnitToggle) => void }) {
  return (
    <View className="flex-row items-center rounded-full p-1" style={{ backgroundColor: Colors.secondaryContainer }}>
      {(['kg', 'korokoro'] as UnitToggle[]).map((unit) => {
        const active = value === unit;
        return (
          <Pressable
            key={unit}
            onPress={() => onChange(unit)}
            className="h-8 items-center justify-center rounded-full px-3"
            style={{ backgroundColor: active ? Colors.primary : 'transparent' }}
          >
            <Text className="text-xs font-semibold" style={{ color: active ? 'white' : 'black' }}>
              {unit === 'kg' ? 'KG' : 'Korokoro'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CerealProductCard({ product }: { product: typeof CEREAL_PRODUCTS[number] }) {
  const [qty, setQty] = useState<Fraction>(0);

  const handlePress = () => {
    if (qty === 0) {
      setQty(0.25);
    }
  };

  const adjustQty = (delta: number) => {
    const idx = FRACTIONS.findIndex((f) => f.val === qty);
    const newIdx = idx + delta;
    if (newIdx < 0) {
      setQty(0);
    } else if (newIdx >= FRACTIONS.length) {
      setQty(FRACTIONS[FRACTIONS.length - 1].val);
    } else {
      setQty(FRACTIONS[newIdx].val);
    }
  };

  const selectedFraction = FRACTIONS.find((f) => f.val === qty);

  return (
    <Pressable
      onPress={handlePress}
      className="w-[48%] rounded-xl bg-white p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: Colors.primaryFixed }}>
        <MaterialIcons name={product.icon} size={28} color={Colors.primary} />
      </View>
      <Text className="mt-2 text-sm font-bold text-neutral-500">{product.name}</Text>
      <View className="mt-1 flex-row items-baseline gap-1">
        <Text className="text-[28px] font-extrabold" style={{ color: Colors.primary }}>{product.priceKes}</Text>
        <Text className="text-xs font-medium" style={{ color: Colors.primary }}>KES</Text>
      </View>

      {qty > 0 && (
        <>
          <View className="my-2 border-t border-neutral-200" />
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => adjustQty(-1)}
              className="h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-300"
            >
              <Text className="text-base font-bold text-neutral-500">−</Text>
            </Pressable>
            <Text className="text-sm font-bold text-neutral-900">{selectedFraction?.label}</Text>
            <Pressable
              onPress={() => adjustQty(1)}
              className="h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-300"
            >
              <Text className="text-base font-bold text-neutral-500">+</Text>
            </Pressable>
          </View>
          <View className="mt-2 flex-row gap-1">
            {FRACTIONS.map((f) => {
              const active = qty === f.val;
              return (
                <Pressable
                  key={f.label}
                  onPress={() => setQty(f.val)}
                  className="h-7 flex-1 items-center justify-center rounded-md"
                  style={{ backgroundColor: active ? Colors.secondaryContainer : Colors.surfaceContainerHigh }}
                >
                  <Text className="text-xs font-semibold" style={{ color: active ? '#191c1d' : '#414844' }}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </Pressable>
  );
}

function PoshoServiceCard({ service }: { service: typeof POSHO_SERVICES[number] }) {
  const { addItem } = useSharedBasket();
  return (
    <View className="flex-row items-center rounded-xl bg-white p-4 mb-3" style={{ borderLeftWidth: 4, borderLeftColor: '#7d5800' }}>
      <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#fef3c7' }}>
        <MaterialIcons name="settings-suggest" size={24} color="#7d5800" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-neutral-900">{service.name}</Text>
        <Text className="text-xs text-neutral-500">{service.subtitle}</Text>
      </View>
      <Text className="mr-3 text-base font-bold" style={{ color: Colors.primary }}>{service.priceKes} <Text className="text-xs">KES</Text></Text>
      <Pressable
        onPress={() => addItem({ id: `posho-${service.id}`, name: service.name, unitPrice: service.priceKes, quantity: 1, icon: 'settings-suggest' })}
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: Colors.secondaryContainer }}
      >
        <Text className="text-lg font-bold" style={{ color: Colors.primary }}>+</Text>
      </Pressable>
    </View>
  );
}

function BasketChips() {
  const { items, removeItem } = useSharedBasket();
  if (items.length === 0) return null;
  return (
    <View className="mb-4">
      <Text className="text-xs font-medium mb-2" style={{ color: Colors.onSurfaceVariant }}>
        Current Basket ({items.length} {items.length === 1 ? 'item' : 'items'})
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {items.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center rounded-full pl-3 pr-1 py-1.5"
            style={{ backgroundColor: Colors.primaryFixed }}
          >
            <Text className="text-sm font-semibold mr-2" style={{ color: Colors.primary }}>{item.name}</Text>
            <Pressable
              onPress={() => removeItem(item.id)}
              className="h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: Colors.secondaryContainer }}
            >
              <MaterialIcons name="close" size={14} color={Colors.primary} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function SalesScreen() {
  const [unit, setUnit] = useState<UnitToggle>('kg');
  const router = useRouter();
  const { items, total } = useSharedBasket();

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
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: items.length > 0 ? 320 : 180 }}>
        <View className="flex-row items-center justify-between mt-6 mb-4">
          <Text className="text-lg font-bold" style={{ color: Colors.onSurface }}>Cereal Sales</Text>
          <UnitTogglePill value={unit} onChange={setUnit} />
        </View>
        <View className="flex-row flex-wrap gap-3">
          {CEREAL_PRODUCTS.map((product) => (
            <CerealProductCard key={product.id} product={product} />
          ))}
        </View>
        <Pressable
          className="mt-4 w-full items-center justify-center rounded-xl border-2 border-dashed py-4"
          style={{ borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerHigh, height: 56 }}
        >
          <Text className="text-base font-semibold" style={{ color: Colors.outline }}>+ Add Custom Item</Text>
        </Pressable>

        <View className="mt-6 mb-2">
          <Text className="text-lg font-bold" style={{ color: Colors.onSurface }}>Poshomill Services</Text>
        </View>
        {POSHO_SERVICES.map((service) => (
          <PoshoServiceCard key={service.id} service={service} />
        ))}

        <BasketChips />
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
