import { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
import SearchBar from '../components/ui/SearchBar';
import CategoryTabs from '../components/ui/CategoryTabs';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useProductSearch } from '../hooks/useProductSearch';
import type { Product } from '../types';

const CATEGORY_ICON: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'Grains & Flour': 'grain',
  'Cooking': 'local-dining',
  'Beverages': 'local-cafe',
  'Household': 'cleaning-services',
};

const CATEGORY_COLOR: Record<string, string> = {
  'Grains & Flour': '#7d5800',
  'Cooking': '#b45309',
  'Beverages': '#1d4ed8',
  'Household': '#166534',
};

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('inventory');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { products } = useProducts();
  const { query, setQuery, selectedCategory, setSelectedCategory, groupedProducts } = useProductSearch(products);

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
    if (tab === 'sales') router.push('/');
    else if (tab === 'reports') router.push('/reports');
    else if (tab === 'credit') router.push('/credit');
  };

  const categories = Object.keys(groupedProducts);

  const renderCategorySection = ({ item: category }: { item: string }) => {
    const items = groupedProducts[category];
    const icon = CATEGORY_ICON[category] || 'category';
    const color = CATEGORY_COLOR[category] || '#374151';

    return (
      <View className="mb-6">
        {/* Category header */}
        <View className="flex-row items-center gap-2 mb-3 px-1">
          <View className="p-1.5 rounded-md" style={{ backgroundColor: color + '18' }}>
            <MaterialIcons name={icon} size={18} color={color} />
          </View>
          <Text className="text-base font-bold" style={{ color }}>
            {category}
          </Text>
          <View className="flex-1 h-px" style={{ backgroundColor: color + '30' }} />
          <Text className="text-xs text-neutral-400">{items.length} items</Text>
        </View>

        {/* Product cards */}
        {items.map((product) => (
          <InventoryProductCard key={product.id} product={product} color={color} />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Inventory" />

      {/* Search bar */}
      <View className="px-4 pb-3 pt-2 bg-white border-b border-neutral-200">
        <View className="px-3 pt-2.5 pb-2">
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
          />
        </View>
      </View>

      {/* Product count summary */}
      <View className="px-4 py-2">
        <Text className="text-sm text-neutral-500">
          {products.length} product{products.length !== 1 ? 's' : ''} registered
          {query || selectedCategory !== 'All'
            ? ` · ${Object.values(groupedProducts).flat().length} showing`
            : ''}
        </Text>
      </View>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        className="mb-2"
      />

      {/* Product list */}
      <FlatList
        data={categories}
        keyExtractor={(cat) => cat}
        renderItem={renderCategorySection}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <MaterialIcons name="search-off" size={48} color="#d1d5db" />
            <Text className="mt-3 text-base text-neutral-400">No products match "{query}"</Text>
          </View>
        }
      />

      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

function InventoryProductCard({ product, color }: { product: Product; color: string }) {
  const router = useRouter();
  const lowStock = (product.stock ?? 0) <= 5;

  return (
    <Pressable
      onPress={() =>
        Alert.alert(
          product.name,
          `Price: KES ${product.price}\nUnit: ${product.unit}\nStock: ${product.stock ?? 'N/A'}\nBarcode: ${product.barcode ?? 'N/A'}`
        )
      }
      android_ripple={{ color: '#00000010' }}
    >
      <View
        className="flex-row items-center gap-3 rounded-lg bg-white p-3 mb-2"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 2,
          elevation: 1,
          borderLeftWidth: 3,
          borderLeftColor: color,
        }}
      >
        {/* Category icon */}
        <View
          className="h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: color + '14' }}
        >
          <MaterialIcons
            name={CATEGORY_ICON[product.category] || 'inventory'}
            size={22}
            color={color}
          />
        </View>

        {/* Product info */}
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-neutral-900"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>
          <Text className="text-xs text-neutral-500">
            {product.category} · {product.unit}
          </Text>
        </View>

        {/* Price + stock */}
        <View className="items-end">
          <Text className="text-base font-bold text-neutral-900">
            KES {product.price.toLocaleString()}
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <MaterialIcons
              name={lowStock ? 'warning' : 'inventory'}
              size={12}
              color={lowStock ? '#dc2626' : '#9ca3af'}
            />
            <Text
              className="text-xs"
              style={{ color: lowStock ? '#dc2626' : '#6b7280' }}
            >
              {product.stock ?? 0} in stock
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
