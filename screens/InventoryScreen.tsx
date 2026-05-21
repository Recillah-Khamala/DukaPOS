import { useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import SearchBar from '../components/ui/SearchBar';
import CategoryTabs from '../components/ui/CategoryTabs';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useProductSearch } from '../hooks/useProductSearch';

export default function ProductsScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('inventory');
  const insets = useSafeAreaInsets();
  const { products } = useProducts();
  const { query, setQuery, selectedCategory, setSelectedCategory, filteredProducts } = useProductSearch(products);

  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'sales') require('expo-router').router.push('/');
    else if (tab === 'reports') require('expo-router').router.push('/reports');
    else if (tab === 'credit') require('expo-router').router.push('/credit');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Products" />

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
            onAdd={() => console.log('add product:', item)}
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
