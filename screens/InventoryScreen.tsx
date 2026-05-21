import { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomNavBar, { BottomNavTab } from '../components/layout/BottomNavBar';
import TopAppBar from '../components/layout/TopAppBar';
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
  const { products } = useProducts();
  const { query, setQuery, groupedProducts } = useProductSearch(products);

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
          <ProductRow key={product.id} product={product} color={color} />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="Inventory" />

      {/* Search bar */}
      <View className="px-4 pb-3 pt-2 bg-white border-b border-neutral-200">
        <View className="flex-row items-center rounded-lg bg-neutral-100 px-3 py-2.5">
          <MaterialIcons name="search" size={20} color="#9ca3af" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-base text-neutral-900"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={20} color="#9ca3af" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Product count summary */}
      <View className="px-4 py-2">
        <Text className="text-sm text-neutral-500">
          {products.length} product{products.length !== 1 ? 's' : ''} registered
          {query ? ` · ${Object.values(groupedProducts).flat().length} matched` : ''}
        </Text>
      </View>

      {/* Product list */}
      <FlatList
        data={categories}
        keyExtractor={(cat) => cat}
        renderItem={renderCategorySection}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
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

function ProductRow({ product, color }: { product: Product; color: string }) {
  const router = useRouter();
  const lowStock = (product.stock ?? 0) <= 5;

  return (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          product.name,
          `Price: KES ${product.price}\nUnit: ${product.unit}\nStock: ${product.stock ?? 'N/A'}\nBarcode: ${product.barcode ?? 'N/A'}`
        )
      }
      activeOpacity={0.7}
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
    </TouchableOpacity>
  );
}
