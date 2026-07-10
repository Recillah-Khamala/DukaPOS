import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavBar from '../../components/layout/BottomNavBar';
import AdjustItemModal from '../../components/sales/AdjustItemModal';
import BagSelectionModal from '../../components/sales/BagSelectionModal';
import SelectableTile from '../../components/ui/SelectableTile';
import Card from '../../components/ui/Card';
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
    <View className="flex-1" style={{ backgroundColor: '#f9fafb' }}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="storefront" size={24} color="white" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Kijiji Cereal Store</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: items.length > 0 ? bottomNavHeight + 140 : bottomNavHeight + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cereal Sales Section */}
        <View className="mt-2 px-4">
          <Card style={{ marginBottom: 12, padding: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.primary }}>Cereal Sales</Text>
              <View style={{ backgroundColor: Colors.secondaryContainer, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: Colors.onSecondaryContainer, fontSize: 12, fontWeight: '700' }}>Unit: Korokoro</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {CEREAL_PRODUCTS.map((product) => {
               const fractionPrices = product.units[0]?.fractionPrices ?? [];
               const minPrice = fractionPrices[0]?.price ?? 0;
               const maxPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
               const unitLabel = product.units[0]?.label ?? 'Korokoro';
               const basketItem = items.find((i) => i.productId === product.id);
               const isOutOfStock = outOfStockIds.has(product.id);
               return (
                   <SelectableTile
                   key={product.id}
                   title={product.name}
                   subtitle={`${minPrice} – ${maxPrice} KES`}
                   detail={`per ${unitLabel}`}
                   iconName={product.icon.replace('_', '-')}
                   active={Boolean(basketItem)}
                   disabled={isOutOfStock}
                   badge={basketItem ? (basketItem.fractionLabel ?? String(basketItem.qty)) + ' in basket' : undefined}
                   onPress={() => setSelectedProduct(product)}
                     style={{ width: '48%' }}
                 />
               );
             })}
              </View>
          </Card>
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
           <Card style={{ marginBottom: 12, padding: 12 }}>
             <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: Colors.primary }}>Poshomill Services</Text>
             <View>
               {POSHOMILL_SERVICES.map((service) => {
               const fractionPrices = service.units[0]?.fractionPrices ?? [];
               const minPrice = fractionPrices[0]?.price ?? 0;
               const maxPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
               const unitLabel = service.units[0]?.label ?? 'Korokoro';
               const basketItem = items.find((i) => i.productId === service.id);
               const isOutOfStock = outOfStockIds.has(service.id);
               return (
                 <SelectableTile
                   key={service.id}
                   title={service.name}
                   subtitle={`${minPrice} – ${maxPrice} KES / ${unitLabel}`}
                   iconName={service.icon.replace('_', '-')}
                   accentLeft
                   accentColor={Colors.secondary}
                   active={Boolean(basketItem)}
                   disabled={isOutOfStock}
                   badge={basketItem ? (basketItem.fractionLabel ?? String(basketItem.qty)) + ' in basket' : undefined}
                   onPress={() => setSelectedProduct(service)}
                 />
               );
             })}
             </View>
           </Card>
         </View>

        {/* Packaging Section */}
        <View className="px-4 mt-4">
          <Card style={{ marginBottom: 12, padding: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: Colors.primary }}>Packaging</Text>
            <View>
              {BAG_PRODUCTS.map((bag) => {
              const minPrice = bag.variants[0]?.price ?? 0;
              const maxPrice = bag.variants[bag.variants.length - 1]?.price ?? 0;
              const basketItem = items.find((i) => i.productId === bag.id);
              const isOutOfStock = outOfStockIds.has(bag.id);
              return (
                <SelectableTile
                  key={bag.id}
                  title={bag.name}
                  subtitle={`${minPrice} – ${maxPrice} KES`}
                  iconName={bag.icon.replace('_', '-')}
                  accentLeft
                  accentColor={Colors.secondary}
                  active={Boolean(basketItem)}
                  disabled={isOutOfStock}
                  badge={basketItem ? 'in basket' : undefined}
                  onPress={() => setSelectedBagProduct(bag)}
                />
              );
            })}
          </View>
        </Card>
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