import { useState, useRef } from 'react';
import { Text, View, FlatList, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import SearchBar from '../components/ui/SearchBar';
import CategoryTabs from '../components/ui/CategoryTabs';
import ProductCard from '../components/ui/ProductCard';
import BasketPreviewBar, { BAR_H } from '../components/ui/BasketPreviewBar';
import { useBasket } from '../hooks/useBasket';
import { useProducts } from '../hooks/useProducts';
import { useProductSearch } from '../hooks/useProductSearch';

/** Approximate height values for the bottom stacked bars layout:
 *
 *  NAVBAR_H  Constant used to keep layout calculations isolated from the
 *          safe-area and device pixel ratios.
 *  BAR_H    (=52) — exported by BasketPreviewBar; the bar's own height.
 *  BOTTOM_ROW_H — how far up the FlatList should draw content above the bar.
 *                 72 + 52 + 8 px gap = 132 px total column.
 */
const NAVBAR_H      = 72;
const BOTTOM_ROW_H = NAVBAR_H + BAR_H + 8;

export default function ProductsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('inventory');
  const insets = useSafeAreaInsets();
  const { items, total, addItem } = useBasket();
  const { products } = useProducts();
  const { query, setQuery, selectedCategory, setSelectedCategory, filteredProducts } = useProductSearch(products);
  const flash = useRef(new Animated.Value(0)).current;

  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  const showFlash = () => {
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 1200, useNativeDriver: true }).start();
  };

  const handleAdd = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: 1,
      icon: 'shopping-bag',
    });
    showFlash();
  };

  const handleCheckout = () => {
    // Checkout placeholder
  };

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'sales') require('expo-router').router.push('/');
    else if (tab === 'reports') require('expo-router').router.push('/reports');
    else if (tab === 'credit') require('expo-router').router.push('/credit');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Products" />

      {/* Success flash toast */}
      <Animated.View
        pointerEvents="none"
        className="absolute top-16 left-0 right-0 items-center z-50"
        style={{ opacity: flash }}
      >
        <View className="bg-[#012d1d] px-5 py-2.5 rounded-full shadow-lg">
          <Text className="text-sm font-medium text-white">Added to basket</Text>
        </View>
      </Animated.View>

      {/* Search bar */}
      <View className="px-4 pb-3 pt-2 bg-white border-b border-neutral-200">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
        />
      </View>

      {/* Category tabs */}
      <View className="px-1 py-2 bg-white border-b border-neutral-100">
        <CategoryTabs
          categories={allCategories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* Product list */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: BOTTOM_ROW_H }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAdd={() => handleAdd(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Text className="mt-3 text-base text-neutral-400">No products found</Text>
            {query && (
              <Text className="mt-1 text-sm text-neutral-300">
                Try adjusting your search or category filter
              </Text>
            )}
          </View>
        }
      />

      {/* Basket preview bar — above BottomNavBar, shown only when basket is non-empty */}
      {items.length > 0 && (
        <View
          className="absolute left-0 right-0 flex-row items-center justify-between px-4 bg-white shadow-lg shadow-black/8"
          style={{
            bottom: BOTTOM_ROW_H,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            borderRadius: 16,
            marginHorizontal: 12,
            height: BAR_H,
            justifyContent: 'space-between',
          }}
        >
          <Text className="text-sm text-neutral-500">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Text>
          <Text className="text-xl font-bold text-neutral-900">
            KES {total.toLocaleString()}
          </Text>
          <Pressable
            onPress={handleCheckout}
            className="px-5 py-2 rounded-full items-center justify-center"
            style={{ backgroundColor: '#ffb702' }}
          >
            <Text className="text-sm font-semibold text-neutral-900">Go to Checkout →</Text>
          </Pressable>
        </View>
      )}

      {/* Bottom navigation bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}
