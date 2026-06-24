import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import AdjustItemModal from '../../components/sales/AdjustItemModal';
import BagSelectionModal from '../../components/sales/BagSelectionModal';
import { useSharedBasket } from '../../context/BasketContext';
import { useInventory } from '../../context/InventoryContext';
import Colors from '../../constants/colors';
import { CEREAL_PRODUCTS, POSHOMILL_SERVICES, BAG_PRODUCTS } from '../../constants/salesData';
import type { BagProduct } from '../../types';

export default function SalesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ saleSuccess?: string; total?: string }>();
  const { items, total } = useSharedBasket();
  const { allItems } = useInventory();
  const outOfStockIds = new Set(allItems.filter(item => item.currentStock === 0).map(item => item.id));
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState <
    typeof CEREAL_PRODUCTS[number] | typeof POSHOMILL_SERVICES[number] | null
  >(null);
  const [selectedBagProduct, setSelectedBagProduct] = useState<BagProduct | null>(null);
  const [bannerTotal, setBannerTotal] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const bannerAnim = useRef(new Animated.Value(-48)).current;

  useEffect(() => {
    if (params.saleSuccess === 'true') {
      setBannerTotal(params.total ? Number(params.total).toLocaleString() : total.toLocaleString());
      setShowBanner(true);
      bannerAnim.setValue(-48);
      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(bannerAnim, {
          toValue: -48,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setShowBanner(false);
          router.replace('/(tabs)/sales');
        });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [params.saleSuccess]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Top App Bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 48,
        paddingBottom: 12,
        backgroundColor: '#012d1d',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <MaterialIcons name="storefront" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialIcons name="search" size={24} color="white" />
          <MaterialIcons name="notifications-none" size={24} color="white" />
        </View>
      </View>

      {/* Success Banner */}
      {showBanner && (
        <Animated.View style={{ transform: [{ translateY: bannerAnim }] }}>
          <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.onPrimary }}>
              ✓ Sale of KES {bannerTotal} recorded
            </Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: items.length > 0 ? bottomNavHeight + 140 : bottomNavHeight + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cereal Sales Section */}
        <View className="mt-2 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-semibold" style={{ color: Colors.primary }}>Cereal Sales</Text>
            <View style={{ backgroundColor: Colors.secondaryContainer, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: Colors.onSecondaryContainer, fontSize: 12, fontWeight: '700' }}>Unit: Korokoro</Text>
            </View>
          </View>
<View className="flex-row flex-wrap gap-3">
             {CEREAL_PRODUCTS.map((product) => {
               const fractionPrices = product.units[0]?.fractionPrices ?? [];
               const minPrice = fractionPrices[0]?.price ?? 0;
               const maxPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
               const unitLabel = product.units[0]?.label ?? 'Korokoro';
               const basketItem = items.find((i) => i.productId === product.id);
               const isOutOfStock = outOfStockIds.has(product.id);
               return (
                 <Pressable
                   key={product.id}
                   onPress={() => setSelectedProduct(product)}
                   disabled={isOutOfStock}
                   className="w-[48%] rounded-xl p-4 border-2 active:scale-95"
                   style={{
                     backgroundColor: basketItem ? Colors.primaryFixed : '#ffffff',
                     borderColor: basketItem ? Colors.primary : 'transparent',
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.08,
                     shadowRadius: 12,
                     elevation: 3,
                     opacity: isOutOfStock ? 0.4 : 1,
                   }}
                 >
                   <View
                     className="w-12 h-12 rounded-lg mb-2 items-center justify-center"
                     style={{ backgroundColor: Colors.primaryFixed }}
                   >
                     <MaterialIcons name={product.icon.replace('_', '-') as any} size={32} color={Colors.primary} />
                   </View>
                   <Text className="font-bold text-sm" style={{ color: Colors.onSurfaceVariant }}>{product.name}</Text>
                   <Text className="text-lg font-extrabold mt-1" style={{ color: Colors.primary }}>
                     {minPrice} – {maxPrice} KES
                   </Text>
                   <Text className="text-xs mt-0.5" style={{ color: Colors.onSurfaceVariant }}>
                     per {unitLabel}
                   </Text>
                   {basketItem && (
                     <View className="mt-2 rounded-full px-2 py-0.5 self-start" style={{ backgroundColor: Colors.primary }}>
                       <Text className="text-xs font-bold" style={{ color: Colors.onPrimary }}>
                         {basketItem.fractionLabel ?? basketItem.qty} in basket
                       </Text>
                     </View>
                   )}
                 </Pressable>
               );
             })}
           </View>
        </View>

        {/* Add Custom Item */}
        <Pressable
          className="mt-4 mx-4 items-center justify-center rounded-xl border-2 border-dashed py-4"
          style={{ borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerHigh }}
        >
          <Text className="text-base font-semibold" style={{ color: Colors.outline }}>+ Add Custom Item</Text>
        </Pressable>

{/* Poshomill Services Section */}
         <View className="px-4 mt-4">
           <Text className="text-xl font-semibold mb-3" style={{ color: Colors.primary }}>Poshomill Services</Text>
           <View className="gap-2">
             {POSHOMILL_SERVICES.map((service) => {
               const fractionPrices = service.units[0]?.fractionPrices ?? [];
               const minPrice = fractionPrices[0]?.price ?? 0;
               const maxPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
               const unitLabel = service.units[0]?.label ?? 'Korokoro';
               const basketItem = items.find((i) => i.productId === service.id);
               const isOutOfStock = outOfStockIds.has(service.id);
               return (
                 <Pressable
                   key={service.id}
                   onPress={() => setSelectedProduct(service)}
                   disabled={isOutOfStock}
                   className="flex-row items-center justify-between rounded-xl p-4 border-l-4 active:scale-95"
                   style={{
                     backgroundColor: basketItem ? Colors.primaryFixed : '#ffffff',
                     borderLeftColor: Colors.secondary,
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.08,
                     shadowRadius: 12,
                     elevation: 3,
                     opacity: isOutOfStock ? 0.4 : 1,
                   }}
                 >
                   <View className="flex-row items-center gap-4">
                     <MaterialIcons name={service.icon.replace('_', '-') as any} size={28} color={Colors.secondary} />
                     <View>
                       <Text className="font-bold text-base" style={{ color: Colors.onSurface }}>{service.name}</Text>
                       <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                         {minPrice} – {maxPrice} KES / {unitLabel}
                       </Text>
                     </View>
                   </View>
                   {basketItem && (
                     <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: Colors.primary }}>
                       <Text className="text-xs font-bold" style={{ color: Colors.onPrimary }}>
                         {basketItem.fractionLabel ?? basketItem.qty} in basket
                       </Text>
                     </View>
                   )}
                 </Pressable>
               );
             })}
           </View>
         </View>

        {/* Packaging Section */}
        <View className="px-4 mt-4">
          <Text className="text-xl font-semibold mb-3" style={{ color: Colors.primary }}>Packaging</Text>
          <View className="gap-2">
            {BAG_PRODUCTS.map((bag) => {
              const minPrice = bag.variants[0]?.price ?? 0;
              const maxPrice = bag.variants[bag.variants.length - 1]?.price ?? 0;
              const basketItem = items.find((i) => i.productId === bag.id);
              return (
                <Pressable
                  key={bag.id}
                  onPress={() => setSelectedBagProduct(bag)}
                  className="flex-row items-center justify-between rounded-xl p-4 border-l-4 active:scale-95"
                  style={{
                    backgroundColor: basketItem ? Colors.primaryFixed : '#ffffff',
                    borderLeftColor: Colors.secondary,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <MaterialIcons name={bag.icon.replace('_', '-') as any} size={28} color={Colors.secondary} />
                    <View>
                      <Text className="font-bold text-base" style={{ color: Colors.onSurface }}>{bag.name}</Text>
                      <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                        {minPrice} – {maxPrice} KES
                      </Text>
                    </View>
                  </View>
                  {basketItem && (
                    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: Colors.primary }}>
                      <Text className="text-xs font-bold" style={{ color: Colors.onPrimary }}>in basket</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Basket Bar */}
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
              Total Due: KES {total.toLocaleString()}
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