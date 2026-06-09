import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Pressable, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import AdjustItemModal from '../../components/sales/AdjustItemModal';
import BagSelectionModal from '../../components/sales/BagSelectionModal';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES, BAG_PRODUCTS } from '../../constants/salesData';
import { formatQty, formatLineTotal } from '../../utils/formatQuantity';
import type { BagProduct } from '../../types';

export default function SalesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ saleSuccess?: string; total?: string }>();
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [flashingId, setFlashingId] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<typeof CEREAL_PRODUCTS[number] | typeof POSHOMILL_SERVICES[number] | null>(null);
  const [selectedBagProduct, setSelectedBagProduct] = useState<BagProduct | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const bannerAnim = useRef(new Animated.Value(-60)).current;
  const { items, total, addItem } = useSharedBasket();

  useEffect(() => {
    if (params.saleSuccess === 'true') {
      setShowBanner(true);
      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(bannerAnim, {
          toValue: -60,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowBanner(false);
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [params.saleSuccess, bannerAnim]);

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

      {showBanner && (
        <Animated.View
          style={{
            transform: [{ translateY: bannerAnim }],
            backgroundColor: '#012d1d',
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
            ✓ Sale of KES {params.total ? Number(params.total).toLocaleString() : total.toLocaleString()} recorded
          </Text>
        </Animated.View>
      )}

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
              <Text>Unit: Korokoro</Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-[12px]">
            {CEREAL_PRODUCTS.map((product) => {
              const isFlashing = flashingId === product.id;
              const currentQty = getQty(product.id);
              const fractionPrices = product.units[0]?.fractionPrices ?? [];
              const minFractionPrice = fractionPrices[0]?.price ?? 0;
              const maxFractionPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
              const unitLabel = product.units[0]?.label ?? 'korokoro';
              const unitPrice = fractionPrices.find(fp => fp.fraction === 1)?.price ?? maxFractionPrice;
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
                  <Text className="text-[28px] font-extrabold text-primary">
                    {minFractionPrice} – {maxFractionPrice} KES / {unitLabel}
                  </Text>

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
                      {formatQty(currentQty)} {unitLabel} × {unitPrice} KES = <Text className="text-base font-bold text-primary">{formatLineTotal(currentQty, unitPrice)}</Text>
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
               const fractionPrices = service.units[0]?.fractionPrices ?? [];
               const minFractionPrice = fractionPrices[0]?.price ?? 0;
               const maxFractionPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
               const unitLabel = service.units[0]?.label ?? 'korokoro';
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
                       <Text className="font-bold text-[14px] text-on-surface-variant">Per Korokoro</Text>
                     </View>
                   </View>
                   <View className="flex-row items-center gap-[12px]">
                     <Pressable
                       onPress={() => {
                         const smallestFraction = fractionPrices[0]?.fraction ?? 0.125;
                         handleQtyChange(service.id, -smallestFraction, smallestFraction, smallestFraction);
                       }}
                       disabled={currentQty <= (fractionPrices[0]?.fraction ?? 0.125)}
                       className={`h-12 w-12 items-center justify-center rounded-full border ${currentQty <= (fractionPrices[0]?.fraction ?? 0.125) ? 'border-outline-variant bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest active:scale-95'}`}
                     >
                       <Text className={`text-lg font-bold ${currentQty <= (fractionPrices[0]?.fraction ?? 0.125) ? 'text-on-surface-variant opacity-50' : 'text-on-surface-variant'}`}>−</Text>
                     </Pressable>
                     <Text className="text-[20px] font-bold text-primary w-10 text-center">{formatQty(currentQty)}</Text>
                     <Pressable
                       onPress={() => {
                         const smallestFraction = fractionPrices[0]?.fraction ?? 0.125;
                         handleQtyChange(service.id, smallestFraction, smallestFraction, smallestFraction);
                       }}
                       className="h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest active:scale-95"
                     >
                       <Text className="text-lg font-bold text-on-surface-variant">+</Text>
                     </Pressable>
                   </View>
                   <View className="mt-2">
                     <Text className="text-sm text-on-surface-variant">
                       {formatQty(currentQty)} {unitLabel} × {maxFractionPrice} KES = <Text className="text-base font-bold text-primary">{formatLineTotal(currentQty, maxFractionPrice)}</Text>
                     </Text>
                   </View>
                 </Pressable>
               );
             })}
           </View>
         </View>

        {/* Packaging Section */}
        <View className="px-[16px] mt-[8px]">
          <Text className="text-[20px] font-semibold text-primary mb-[8px]">Packaging</Text>
          <View className="flex-col gap-[8px]">
            {BAG_PRODUCTS.map((bag) => {
              const isFlashing = flashingId === bag.id;
              const minVariant = bag.variants[0];
              const maxVariant = bag.variants[bag.variants.length - 1];
              return (
                <Pressable
                  key={bag.id}
                  onPress={() => setSelectedBagProduct(bag)}
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
                    <MaterialIcons name={bag.icon.replace('_', '-') as any} size={28} color={Colors.secondary} />
                    <View>
                      <Text className="font-bold text-[16px] text-on-surface">{bag.name}</Text>
                      <Text className="font-bold text-[14px] text-on-surface-variant">
                        {minVariant?.price} – {maxVariant?.price} KES
                      </Text>
                    </View>
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
              Total Due: KES {total}
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
      <BagSelectionModal product={selectedBagProduct} onClose={() => setSelectedBagProduct(null)} />
      <BottomNavBar activeTab="sales" onHeightMeasured={setBottomNavHeight} />
    </View>
  );
}
