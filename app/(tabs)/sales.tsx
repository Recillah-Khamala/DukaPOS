import React, { useState, useCallback, useRef } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import AdjustItemModal from '../../components/sales/AdjustItemModal';
import BagSelectionModal from '../../components/sales/BagSelectionModal';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES } from '../../constants/salesData';
import { formatQty } from '../../utils/formatQuantity';
import type { BagType, BagSize } from '../../constants/bagData';

export default function SalesScreen() {
  const router = useRouter();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [modes, setModes] = useState<Record<string, 'kg' | 'bag' | 'pack'>>({});
  const [selectedProduct, setSelectedProduct] = useState<typeof CEREAL_PRODUCTS[number] | typeof POSHOMILL_SERVICES[number] | null>(null);
  const [bagProduct, setBagProduct] = useState<typeof CEREAL_PRODUCTS[number] | null>(null);
  const { items, total, addItem } = useSharedBasket();

  const handleQtyChange = useCallback(
    (id: string, delta: number, min: number, step: number) => {
      setQtys((prev) => {
        const current = prev[id] ?? 1;
        const next = Math.max(min, current + delta);
        return { ...prev, [id]: next };
      });
    },
    []
  );

  const addToBasket = useCallback(
    (id: string, name: string, unitPrice: number, qty: number, type: 'cereal' | 'service', productId: string, bagType?: BagType, bagSize?: BagSize, packagingMode?: 'kg' | 'bag' | 'pack') => {
      addItem({
        id: `${id}_${Date.now()}`,
        productId,
        name,
        qty,
        unitPrice,
        type,
        bagType,
        bagSize,
        packagingMode,
      });
      setFlashingId(id);
      setTimeout(() => setFlashingId(null), 300);
    },
    [addItem]
  );

  const handleBagConfirm = useCallback(
    (bagType: BagType, bagSize: BagSize, qty: number) => {
      if (!bagProduct) return;
      const sizeLabel = bagSize === 'small' ? 'Small' : bagSize === 'medium' ? 'Medium' : 'Big';
      const typeLabel = bagType === 'plastic' ? 'Plastic' : 'Woven';
      const sizeMultiplier = bagSize === 'small' ? 0.5 : bagSize === 'medium' ? 1 : 2;
      addItem({
        id: `${bagProduct.id}_bag_${Date.now()}`,
        productId: bagProduct.id,
        name: `${bagProduct.name} — ${sizeLabel} ${typeLabel} Bag`,
        qty,
        unitPrice: (bagProduct.pricePerBag ?? 5) * sizeMultiplier,
        type: 'cereal',
        bagType,
        bagSize,
        packagingMode: 'bag',
      });
      setFlashingId(bagProduct.id);
      setTimeout(() => setFlashingId(null), 300);
      setBagProduct(null);
    },
    [bagProduct, addItem]
  );

  const getQty = (id: string) => qtys[id] ?? 1;

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
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: items.length > 0 ? bottomNavHeight + 140 : bottomNavHeight + 24,
          }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
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
              const currentQty = getQty(product.id);
              const currentMode = modes[product.id] ?? 'kg';
              return (
                <Pressable
                  key={product.id}
                  onPress={() => setSelectedProduct(product)}
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

                  <View className="flex-row gap-1 mt-2">
                    {(['kg', 'bag', 'pack'] as const).map((m) => {
                      const isActive = currentMode === m;
                      return (
                        <Pressable
                          key={m}
                          onPress={() => {
                            setModes((prev) => ({ ...prev, [product.id]: m }));
                            if (m === 'bag' || m === 'pack') {
                              setBagProduct(product);
                            } else {
                              setSelectedProduct(product);
                            }
                          }}
                          className="flex-1 items-center px-2 py-1 rounded-md active:scale-95"
                          style={{ backgroundColor: isActive ? Colors.secondaryContainer : 'transparent' }}
                        >
                          <Text className="text-[12px] font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                            {m.toUpperCase()}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View className="flex-row items-center gap-[12px] mt-3">
                    <Pressable
                      onPress={() => handleQtyChange(product.id, -0.125, 0.125, 0.125)}
                      disabled={currentQty <= 0.125}
                      className={`h-12 w-12 items-center justify-center rounded-full border ${currentQty <= 0.125 ? 'border-outline-variant bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest active:scale-95'}`}
                    >
                      <Text className={`text-lg font-bold ${currentQty <= 0.125 ? 'text-on-surface-variant opacity-50' : 'text-on-surface-variant'}`}>−</Text>
                    </Pressable>
                    <Text className="text-[20px] font-bold text-primary w-10 text-center">{formatQty(currentQty)}</Text>
                    <Pressable
                      onPress={() => handleQtyChange(product.id, 0.125, 0.125, 0.125)}
                      className="h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest active:scale-95"
                    >
                      <Text className="text-lg font-bold text-on-surface-variant">+</Text>
                    </Pressable>
                  </View>
                  <View className="mt-2">
                    <Text className="text-sm text-on-surface-variant">
                      {formatQty(currentQty)} kg × {product.pricePerKg} KES = <Text className="text-base font-bold text-primary">{(currentQty * product.pricePerKg).toFixed(2)} KES</Text>
                    </Text>
                  </View>
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
              const currentQty = getQty(service.id);
              return (
                <Pressable
                  key={service.id}
                  onPress={() => setSelectedProduct(service)}
                  className={`flex-row items-center justify-between bg-surface-container-lowest rounded-xl p-[16px] border-l-[4px] active:scale-95 ${isFlashing ? 'border-secondary' : 'border-[#7d5800]'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center gap-[16px]">
                    <MaterialIcons name={service.icon.replace('_', '-') as any} size={28} color="#7d5800" />
                    <View>
                      <Text className="font-bold text-[16px] text-on-surface">{service.name}</Text>
                      <Text className="font-bold text-[14px] text-on-surface-variant">Per KG</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-[12px]">
                    <Pressable
                      onPress={() => handleQtyChange(service.id, -1, 1, 1)}
                      disabled={currentQty <= 1}
                      className={`h-12 w-12 items-center justify-center rounded-full border ${currentQty <= 1 ? 'border-outline-variant bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest active:scale-95'}`}
                    >
                      <Text className={`text-lg font-bold ${currentQty <= 1 ? 'text-on-surface-variant opacity-50' : 'text-on-surface-variant'}`}>−</Text>
                    </Pressable>
                    <Text className="text-[20px] font-bold text-primary w-10 text-center">{formatQty(currentQty)}</Text>
                    <Pressable
                      onPress={() => handleQtyChange(service.id, 1, 1, 1)}
                      className="h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest active:scale-95"
                    >
                      <Text className="text-lg font-bold text-on-surface-variant">+</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 16 }} />
        </ScrollView>
      </View>

      {items.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: bottomNavHeight + 12,
            left: 12,
            right: 12,
            backgroundColor: Colors.primary,
            borderRadius: 12,
            padding: 16,
            zIndex: 10,
            pointerEvents: 'box-none',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.onPrimary }}>
              Total Due: Ksh {total.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.onPrimary, opacity: 0.9 }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/checkout')}
            style={({ pressed }) => ({
              backgroundColor: Colors.onPrimary,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.primary, textAlign: 'center' }}>
              Confirm Sale
            </Text>
          </Pressable>
        </View>
      )}

      <AdjustItemModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <BagSelectionModal product={bagProduct} onClose={() => setBagProduct(null)} onConfirm={handleBagConfirm} />
      <BottomNavBar activeTab="sales" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}