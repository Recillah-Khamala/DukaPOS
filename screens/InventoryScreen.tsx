import { useState, useRef } from 'react';
import { Text, View, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import SearchBar from '../components/ui/SearchBar';
import CategoryTabs from '../components/ui/CategoryTabs';
import ProductCard from '../components/ui/ProductCard';
import { useBasket } from '../hooks/useBasket';
import { useProducts } from '../hooks/useProducts';
import { useProductSearch } from '../hooks/useProductSearch';

export default function ProductsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('inventory');
  const insets = useSafeAreaInsets();
  const { addItem } = useBasket();
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }}
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

      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}
