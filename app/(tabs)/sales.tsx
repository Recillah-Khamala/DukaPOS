import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TopAppBar from '../../components/layout/TopAppBar';
import BasketItemCard from '../../components/ui/BasketItemCard';
import ProductCard from '../../components/ui/ProductCard';
import SearchBar from '../../components/ui/SearchBar';
import PaymentMethodSelector from '../../components/ui/PaymentMethodSelector';
import ChangeCalculator from '../../components/ui/ChangeCalculator';
import { mockProducts } from '../../constants/mockProducts';
import { useSharedBasket } from '../../context/BasketContext';
import { useProducts } from '../../hooks/useProducts';
import { useProductSearch } from '../../hooks/useProductSearch';
import { useSalesHistory } from '../../hooks/useSalesHistory';
import type { PaymentMethod, Sale } from '../../types';

const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'Grains & Flour': 'grain',
  'Cooking': 'local-dining',
  'Beverages': 'local-cafe',
  'Household': 'cleaning-services',
};

const initialBasketItems = mockProducts.slice(0, 3).map((product, idx) => ({
  id: product.id,
  name: product.name,
  unitPrice: product.price,
  quantity: [2, 3, 1][idx] ?? 1,
  icon: ICON_MAP[product.category] || 'shopping-bag' as const,
}));

const CATEGORY_COLOR: Record<string, string> = {
  'Grains & Flour': '#7d5800',
  'Cooking': '#b45309',
  'Beverages': '#1d4ed8',
  'Household': '#166534',
};

export default function HomeScreen() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const insets = useSafeAreaInsets();
  const { items, addItem, clearBasket, total } = useSharedBasket();
  const { salesHistory, addSale } = useSalesHistory();
  const { products } = useProducts();
  const { query, setQuery, groupedProducts } = useProductSearch(products);

  // Seed demo items into the shared basket on first mount
  useEffect(() => {
    if (items.length === 0) {
      initialBasketItems.forEach(addItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProductToBasket = (product: typeof mockProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: 1,
      icon: ICON_MAP[product.category] || 'shopping-bag',
    });
    setShowQuickAdd(false);
    setQuery('');
    Alert.alert('Added', `${product.name} added to basket`);
  };

  const handleCompleteSale = () => {
    if (items.length === 0) {
      Alert.alert('Empty Basket', 'Add at least one item before completing a sale.');
      return;
    }
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      items,
      total,
      paymentMethod,
      createdAt: new Date(),
    };
    addSale(newSale);
    clearBasket();
    Alert.alert('Sale Complete', `Sale completed with ${paymentMethod}\nChange: KES ${Math.max(0, cashReceived - total).toLocaleString()}`);
  };

  const quickAddCategories = Object.keys(groupedProducts);

  const renderQuickAddItem = ({ item: category }: { item: string }) => {
    const categoryProducts = groupedProducts[category];
    const color = CATEGORY_COLOR[category] || '#374151';
    return (
      <View className="mb-4">
        <Text className="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style={{ color }}>
          {category}
        </Text>
        {categoryProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => handleAddProductToBasket(product)}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TopAppBar title="DukaPOS" onHelp={handleHelp} onClose={handleClose} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 160 }}
        className="px-4 py-4"
      >
        {/* Quick Add Products */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-neutral-900">Quick Add</Text>
            <Pressable onPress={() => setShowQuickAdd(!showQuickAdd)} className="flex-row items-center gap-1">
              <MaterialIcons
                name={showQuickAdd ? 'expand-less' : 'expand-more'}
                size={22}
                color="#012d1d"
              />
              <Text className="text-sm font-medium" style={{ color: '#012d1d' }}>
                {showQuickAdd ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>

          {showQuickAdd && (
            <View className="rounded-xl bg-white shadow-sm overflow-hidden">
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search products..."
                className="mx-1 mt-1.5 mb-1"
              />

              <FlatList
                data={quickAddCategories}
                keyExtractor={(cat) => cat}
                renderItem={renderQuickAddItem}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
                ListEmptyComponent={
                  <View className="items-center py-6">
                    <MaterialIcons name="search-off" size={36} color="#d1d5db" />
                    <Text className="mt-2 text-sm text-neutral-400">No products match "{query}"</Text>
                  </View>
                }
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>

        <View className="flex justify-between items-center mb-4">
          <Text className="text-2xl font-semibold text-neutral-900">Basket Items</Text>
          <Pressable onPress={clearBasket} className="px-4 py-1.5 rounded-md bg-red-50">
            <Text className="text-sm font-medium text-red-600">Clear All</Text>
          </Pressable>
        </View>

        {items.length === 0 ? (
          <View className="items-center py-8">
            <MaterialIcons name="shopping-basket" size={48} color="#d1d5db" />
            <Text className="mt-2 text-neutral-400">Your basket is empty</Text>
            <Text className="mt-1 text-xs text-neutral-300">Tap a product above to add it</Text>
          </View>
        ) : (
          <View className="gap-3">
            {items.map((item) => (
              <BasketItemCard key={item.id} item={item} />
            ))}
          </View>
        )}
        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} className="my-6" />
        <ChangeCalculator totalBill={total} cashReceived={cashReceived} onCashReceivedChange={setCashReceived} className="my-6" />
        <View className="my-6">
          <Pressable
            onPress={handleCompleteSale}
            className="w-full py-3 rounded-lg items-center"
            style={{ backgroundColor: '#012d1d' }}
          >
            <Text className="text-base font-semibold text-white">COMPLETE SALE & PRINT</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

function handleHelp() {
  Alert.alert('Help', 'This is the DukaPOS help section');
}

function handleClose() {
  Alert.alert('Close', 'Close button pressed');
}
