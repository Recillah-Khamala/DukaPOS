import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { FormField } from './FormField';
import { CategoryPicker } from './CategoryPicker';
import type { CreditItemCategory } from '../../hooks/useCreditLedger';

type DraftItem = {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
};

type ItemEntryCardProps = {
  item: DraftItem;
  index: number;
  onUpdate: (key: string, patch: Partial<DraftItem>) => void;
  onRemove: (key: string) => void;
  canRemove?: boolean;
};

export const ItemEntryCard = ({
  item,
  index,
  onUpdate,
  onRemove,
  canRemove = true,
}: ItemEntryCardProps) => {
  const itemTotal = (parseFloat(item.qty || '0') || 0) * (parseFloat(item.unitPrice || '0') || 0);

  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: Colors.outlineVariant,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: Colors.onSurface, fontSize: 13, fontWeight: '700' }}>
          Item {index + 1}
        </Text>
        {canRemove && (
          <TouchableOpacity onPress={() => onRemove(item.key)}>
            <MaterialIcons name="close" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category picker */}
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
        Category
      </Text>
      <CategoryPicker
        selected={item.category}
        onSelect={(value) => onUpdate(item.key, { category: value })}
      />

      {/* Item Name */}
      <FormField
        label="Item Name"
        value={item.name}
        onChangeText={(text) => onUpdate(item.key, { name: text })}
        placeholder="e.g. Maize"
      />

      {/* Qty + Unit Price side by side */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <FormField
            label="Quantity"
            value={item.qty}
            onChangeText={(text) => onUpdate(item.key, { qty: text })}
            placeholder="e.g. 2"
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <FormField
            label="Unit Price (KES)"
            value={item.unitPrice}
            onChangeText={(text) => onUpdate(item.key, { unitPrice: text })}
            placeholder="e.g. 130"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Line total */}
      <Text style={{ color: Colors.onSurfaceVariant, fontSize: 13, fontWeight: '600' }}>
        Line total: KES {itemTotal.toLocaleString()}
      </Text>
    </View>
  );
};