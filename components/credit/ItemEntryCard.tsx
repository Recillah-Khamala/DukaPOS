import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditItemCategory } from '../../hooks/useCreditLedger';
import FormField from './FormField';
import CategoryPicker from './CategoryPicker';
import ProductPickerModal from './ProductPickerModal';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

interface DraftItem {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
  productId?: string;
}

interface ItemEntryCardProps {
  item: DraftItem;
  index: number;
  onUpdate: (key: string, patch: Partial<DraftItem>) => void;
  onRemove: (key: string) => void;
  canRemove: boolean;
  onProductSelect?: (product: { productId: string; name: string }) => void;
}

const ItemEntryCard: React.FC<ItemEntryCardProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove,
  onProductSelect,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; category: string } | null>(null);

const handleNameChange = (text: string) => {
     onUpdate(item.key, { name: text, productId: undefined });
     // If user manually edits the name, clear the product selection
     setSelectedProduct(null);
   };

  const handleQtyChange = (text: string) => {
    onUpdate(item.key, { qty: text });
  };

  const handleUnitPriceChange = (text: string) => {
    onUpdate(item.key, { unitPrice: text });
  };

  const calculateLineTotal = () => {
    const qty = parseFloat(item.qty || '0') || 0;
    const unitPrice = parseFloat(item.unitPrice || '0') || 0;
    return (qty * unitPrice).toLocaleString();
  };

  return (
    <>
      <View style={{
        borderWidth: 1.5,
        borderColor: Colors.outlineVariant,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
      }}>
        {/* Header row */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '700',
            color: Colors.onSurface,
          }}>
            Item {index + 1}
          </Text>
          {canRemove && (
            <TouchableOpacity
              onPress={() => onRemove(item.key)}
            >
              <MaterialIcons
                name="close"
                size={18}
                color={Colors.onSurfaceVariant}
/>
            </TouchableOpacity>
          )}
        </View>

        {/* CategoryPicker */}
        <CategoryPicker
          selected={item.category}
          onSelect={(cat) => onUpdate(item.key, { category: cat })}
        />

        {/* Button to open product picker */}
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select Product</Text>
        </TouchableOpacity>

{/* Item Name - either selected product label or text input */}
        {selectedProduct ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <Text style={{ fontSize: 16, color: Colors.onSurface }}>
              {selectedProduct.name}
            </Text>
            <TouchableOpacity
              style={{ marginLeft: 12, padding: 4 }}
              onPress={() => {
                setSelectedProduct(null);
                onUpdate(item.key, { productId: undefined });
                // Clear product selection when user removes the selected product
              }}
            >
              <Text style={{ color: Colors.error, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
) : (
          <>
            <FormField
              label="Item Name"
              placeholder="e.g. Maize"
              value={item.name}
              onChangeText={handleNameChange}
            />
            {item.productId === undefined && item.name.trim() !== '' && (
              <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 4 }}>
                not linked to inventory
              </Text>
            )}
          </>
        )}

        {/* Quantity and Unit Price row */}
        <View style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 10,
        }}>
          <View style={{ flex: 1 }}>
            <FormField
              label="Quantity"
              placeholder="e.g. 2"
              keyboardType="numeric"
              value={item.qty}
              onChangeText={handleQtyChange}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormField
              label="Unit Price (KES)"
              placeholder="e.g. 130"
              keyboardType="numeric"
              value={item.unitPrice}
              onChangeText={handleUnitPriceChange}
            />
          </View>
        </View>

        {/* Line total */}
        <Text style={{
          fontSize: 13,
          fontWeight: '600',
          color: Colors.onSurfaceVariant,
        }}>
          Line total: KES {calculateLineTotal()}
        </Text>
      </View>
<ProductPickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(product) => {
          console.log('selected', product);
          setSelectedProduct({ id: product.id, name: product.name, category: product.category });
          onUpdate(item.key, { name: product.name });
          if (onProductSelect) {
            onProductSelect({ productId: product.id, name: product.name });
          }
          setShowPicker(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  selectButtonText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ItemEntryCard;