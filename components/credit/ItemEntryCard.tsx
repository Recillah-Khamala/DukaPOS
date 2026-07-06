import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditItemCategory } from '../../hooks/useCreditLedger';
import { FormField } from './FormField';
import { CategoryPicker } from './CategoryPicker';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

interface DraftItem {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
}

interface ItemEntryCardProps {
  item: DraftItem;
  index: number;
  onUpdate: (key: string, patch: Partial<DraftItem>) => void;
  onRemove: (key: string) => void;
  canRemove: boolean;
}

const ItemEntryCard: React.FC<ItemEntryCardProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const handleNameChange = (text: string) => {
    onUpdate(item.key, { name: text });
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

      {/* Item Name */}
      <FormField
        label="Item Name"
        placeholder="e.g. Maize"
        value={item.name}
        onChangeText={handleNameChange}
      />

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
  );
};

export default ItemEntryCard;