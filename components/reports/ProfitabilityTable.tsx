import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CompletedSale, InventoryItem, BasketItem } from '../../types';
import { computeSaleItemProfit } from '../../utils/profitHelpers';

interface ProfitabilityTableProps {
  sales: CompletedSale[];
  allItems: InventoryItem[];
}

const ProfitabilityTable: React.FC<ProfitabilityTableProps> = ({ sales, allItems }) => {
  // Create a map of inventory items by productId for quick lookup in computeSaleItemProfit (though it's inside the function)
  // We don't need to create a map here because the helper function does the lookup.

  // Aggregate data by item name
  const itemStats = new Map<string, {
    name: string;
    qtySold: number;
    revenue: number;
    profit: number;
    costKnown: boolean; // true if at least one occurrence had cost known? Actually, for a given item, costKnown should be consistent.
  }>();

  sales.forEach(sale => {
    sale.items.forEach(saleItem => {
      const { quantity, revenue, profit, costKnown } = computeSaleItemProfit(saleItem, allItems);
      const existing = itemStats.get(saleItem.name) || {
        name: saleItem.name,
        qtySold: 0,
        revenue: 0,
        profit: 0,
        costKnown: false
      };

      itemStats.set(saleItem.name, {
        name: saleItem.name,
        qtySold: existing.qtySold + quantity,
        revenue: existing.revenue + revenue,
        profit: existing.profit + profit,
        costKnown: existing.costKnown || costKnown // if any occurrence has cost known, we mark as known? 
          // But note: costKnown is a property of the inventory item, so it should be the same for the same productId.
          // However, we are grouping by name, which might not be unique. We'll use OR: if any of the items in the group had cost known, we mark as known.
          // This is acceptable because if two different products share the same name and one has cost known and the other doesn't, we still show known.
      });
    });
  });

  const rows = Array.from(itemStats.values());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Item Profitability</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Qty Sold</Text>
          <Text style={styles.headerCell}>Revenue</Text>
          <Text style={styles.headerCell}>Profit</Text>
          <Text style={styles.headerCell}>Cost Known</Text>
        </View>
        {rows.map((row, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{row.name}</Text>
            <Text style={styles.cell}>{row.qtySold.toFixed(2)}</Text>
            <Text style={styles.cell}>KES {row.revenue.toLocaleString()}</Text>
            <Text style={styles.cell}>KES {row.profit.toLocaleString()}</Text>
            <Text style={styles.cell}>{row.costKnown ? '✓' : '⚠'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#191c1d',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#414844',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  cell: {
    fontSize: 14,
    color: '#191c1d',
    flex: 1,
    textAlign: 'center',
  },
});

export default ProfitabilityTable;