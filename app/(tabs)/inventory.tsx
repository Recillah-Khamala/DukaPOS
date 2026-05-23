import { useState, useRef } from 'react';
import { Text, View, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import SearchBar from '../../components/ui/SearchBar';
import CategoryTabs from '../../components/ui/CategoryTabs';
import ProductCard from '../../components/ui/ProductCard';
import BasketPreviewBar, { BAR_H } from '../../components/ui/BasketPreviewBar';
import { useSharedBasket } from '../../context/BasketContext';
import { useProducts } from '../../hooks/useProducts';
import { useProductSearch } from '../../hooks/useProductSearch';

export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, total, addItem, removeItem, updateQuantity } = useSharedBasket();
  const { products } = useProducts();
  const { query, setQuery, selectedCategory, setSelectedCategory, filteredProducts } = useProductSearch(products);
  const flash = useRef(new Animated.Value(0)).current;

  const allCategories = Array.from(new Set(products.map((p) => p.category)));
  const basketByProductId = Object.fromEntries(items.map((i) => [i.id, i.quantity]));

  const showFlash = () => {
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 1200, useNativeDriver: true }).start();
  };

  const handleAdd = (product: typeof products[0]) => {
    const existing = basketByProductId[product.id] ?? 0;
    if (existing > 0) {
      updateQuantity(product.id, existing + 1);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        icon: 'shopping-bag',
      });
    }
    showFlash();
  };

  const handleRemove = (product: typeof products[0]) => {
    const existing = basketByProductId[product.id] ?? 0;
    if (existing <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, existing - 1);
    }
  };

   const handleCheckout = () => {
     router.push('/checkout');
   };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Products" />
      <Animated.View pointerEvents="none" className="absolute top-16 left-0 right-0 items-center z-50" style={{ opacity: flash }}>
        <View className="bg-[#012d1d] px-5 py-2.5 rounded-full shadow-lg">
          <Text className="text-sm font-medium text-white">Added to basket</Text>
        </View>
      </Animated.View>
      <View className="px-4 pb-3 pt-2 bg-white border-b border-neutral-200">
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search products..." />
      </View>
      <View className="px-1 py-2 bg-white border-b border-neutral-100">
        <CategoryTabs categories={allCategories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: BAR_H + 8 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            currentQty={basketByProductId[item.id] ?? 0}
            onAdd={() => handleAdd(item)}
            onRemove={() => handleRemove(item)}
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
      {items.length > 0 && (
        <BasketPreviewBar
          itemCount={items.length}
          total={total}
          onPress={handleCheckout}
        />
      )}
      <BottomNavBar activeTab="inventory" />
    </View>
  );
}