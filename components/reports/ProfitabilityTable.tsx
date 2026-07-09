import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CompletedSale, InventoryItem, BasketItem } from '../../types';
import { computeSaleItemProfit } from '../../utils/profitHelpers';

interface ProfitabilityTableProps {
  sales: CompletedSale[];
  allItems: InventoryItem[];
}

const ProfitabilityTable: React.FC<ProfitabilityTableProps> = ({ sales, allItems }) => {
  const [groupByCategory, setGroupByCategory] = useState(false);

  const getCategory = (item: BasketItem): string => {
    switch (item.type) {
      case 'cereal':
        return 'Cereal';
      case 'bag':
        return 'Bags';
      case 'service':
        return 'Service';
      default:
        return 'Unknown';
    }
  };

  // Aggregate data by either item name or category
  const itemStats = new Map<string, {
    name: string;
    qtySold: number;
    revenue: number;
    profit: number;
    costKnown: boolean; // true if all items in group have known cost
  }>();

  sales.forEach(sale => {
    sale.items.forEach(saleItem => {
      const { quantity, revenue: itemRevenue, profit: itemProfit, costKnown: itemCostKnown } =
        computeSaleItemProfit(saleItem, allItems);

      const groupKey = groupByCategory ? getCategory(saleItem) : saleItem.name;

      const existing = itemStats.get(groupKey) || {
        name: groupKey,
        qtySold: 0,
        revenue: 0,
        profit: 0,
        costKnown: true, // Start with true, will become false if any item has unknown cost
      };

      itemStats.set(groupKey, {
        name: groupKey,
        qtySold: existing.qtySold + quantity,
        revenue: existing.revenue + itemRevenue,
        profit: existing.profit + itemProfit,
        costKnown: existing.costKnown && itemCostKnown, // True only if all items so far have known cost
      });
    });
  });

  const rows = Array.from(itemStats.values());

  // Check if we have any data
  const hasData = rows.length > 0;
  // Check if all rows have costKnown: false (meaning no buying prices set)
  const allCostUnknown = hasData && rows.every(row => !row.costKnown);

  return (
    <View className="my-4">
      {/* Toggle between Item and Category grouping */}
      <View className="flex-row bg-surface p-2 rounded-lg mb-3">
        <TouchableOpacity
          onPress={() => setGroupByCategory(false)}
          className={`flex-1 py-2.5 px-4 rounded-md mx-1 items-center justify-center ${
            !groupByCategory ? 'bg-primary' : ''
          }`}
        >
          <Text className={`text-sm font-semibold ${!groupByCategory ? 'text-onPrimary' : 'text-onSurfaceVariant'}`}>
            By Item
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGroupByCategory(true)}
          className={`flex-1 py-2.5 px-4 rounded-md mx-1 items-center justify-center ${
            groupByCategory ? 'bg-primary' : ''
          }`}
        >
          <Text className={`text-sm font-semibold ${groupByCategory ? 'text-onPrimary' : 'text-onSurfaceVariant'}`}>
            By Category
          </Text>
        </TouchableOpacity>
      </View>

      {/* Note for category grouping */}
      {groupByCategory && (
        <View className="mb-3 px-4">
          <Text className="text-xs text-onSurfaceVariant italic">
            Note: Milling and other services are grouped together under "Service" category.
          </Text>
        </View>
      )}

      {/* Empty state when no sales data */}
      {!hasData && (
        <View className="p-6 items-center">
          <Text className="text-base text-onSurfaceVariant text-center">
            No sales data for the selected period.
          </Text>
        </View>
      )}

      {/* Empty state when all items have unknown cost */}
      {allCostUnknown && (
        <View className="p-6 items-center">
          <Text className="text-base text-onSurfaceVariant text-center">
            Set buying prices in Inventory to see real profit numbers
          </Text>
        </View>
      )}

      {/* Table Header and Table (only show if we have data and not all cost unknown) */}
      {!allCostUnknown && hasData && (
        <View>
          <View className="py-3 px-4 bg-surface">
            <Text className="text-lg font-semibold text-onSurface">Item Profitability</Text>
          </View>

          {/* Table */}
          <View className="border border-outlineVariant rounded-lg overflow-hidden">
            <View className="flex-row bg-surface py-3 px-4 border-b border-outlineVariant">
              <Text className="text-sm font-semibold text-onSurfaceVariant flex-1">
                {groupByCategory ? 'Category' : 'Name'}
              </Text>
              <Text className="text-sm font-semibold text-onSurfaceVariant flex-1">Qty Sold</Text>
              <Text className="text-sm font-semibold text-onSurfaceVariant flex-1">Revenue</Text>
              <Text className="text-sm font-semibold text-onSurfaceVariant flex-1">Profit</Text>
              <Text className="text-sm font-semibold text-onSurfaceVariant flex-1">Cost Known</Text>
            </View>
            {rows.map((row, index) => (
              <View
                key={index}
                className={`flex-row py-3 px-4 ${index < rows.length - 1 ? 'border-b border-outlineVariant/40' : ''}`}
              >
                <Text className="text-sm text-onSurface flex-1 text-center">{row.name}</Text>
                <Text className="text-sm text-onSurface flex-1 text-center">{row.qtySold.toFixed(2)}</Text>
                <Text className="text-sm text-onSurface flex-1 text-center">KES {row.revenue.toLocaleString()}</Text>
                <Text className="text-sm text-onSurface flex-1 text-center">KES {row.profit.toLocaleString()}</Text>
                <Text className="text-sm text-onSurface flex-1 text-center">{row.costKnown ? '✓' : '⚠'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfitabilityTable;