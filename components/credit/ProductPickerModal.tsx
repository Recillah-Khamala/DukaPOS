import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

// Hardcoded fake products for the picker
const FAKE_PRODUCTS = [
  { id: 'p1', name: 'Maize Korokoro', category: 'cereal' },
  { id: 'p2', name: 'Wheat Flour', category: 'cereal' },
  { id: 'p3', name: 'Plastic Bags', category: 'bags' },
];

interface ProductPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (product: typeof FAKE_PRODUCTS[number]) => void;
}

const ProductPickerModal: React.FC<ProductPickerModalProps> = ({ visible, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const translateY = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        if (!visible) {
          onClose();
        }
      });
    }
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />
      {/* Animated Sheet */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: Colors.surface,
          transform: [{ translateY: translateY }],
        }}
      >
        {/* Handle */}
        <View style={styles.handle}>
          <View style={{ width: 40, height: 4, backgroundColor: Colors.outlineVariant, borderRadius: 2 }} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Product List */}
        <FlatList
          data={FAKE_PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
          )}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  handle: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.onSurface,
  },
  listContent: {
    paddingBottom: 24,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
});

export default ProductPickerModal;