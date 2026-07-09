import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CompletedSale, InventoryItem, BasketItem } from '../../types';
import { computeSaleItemProfit } from '../../utils/profitHelpers';
import Colors from '../../constants/colors';

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
        costKnown: true // Start with true, will become false if any item has unknown cost
      };
      
      itemStats.set(groupKey, {
        name: groupKey,
        qtySold: existing.qtySold + quantity,
        revenue: existing.revenue + itemRevenue,
        profit: existing.profit + itemProfit,
        costKnown: existing.costKnown && itemCostKnown // True only if all items so far have known cost
      });
    });
  });

  const rows = Array.from(itemStats.values());
  
  // Check if we have any data
  const hasData = rows.length > 0;
  // Check if all rows have costKnown: false (meaning no buying prices set)
  const allCostUnknown = hasData && rows.every(row => !row.costKnown);

  return (
    <View style={styles.container}>
      {/* Toggle between Item and Category grouping */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          onPress={() => setGroupByCategory(false)}
          style={[
            styles.toggleButton,
            !groupByCategory && styles.toggleButtonActive
          ]}
        >
          <Text style={[
            styles.toggleButtonText,
            !groupByCategory && styles.toggleButtonTextActive
          ]}>By Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setGroupByCategory(true)}
          style={[
            styles.toggleButton,
            groupByCategory && styles.toggleButtonActive
          ]}
        >
          <Text style={[
            styles.toggleButtonText,
            groupByCategory && styles.toggleButtonTextActive
          ]}>By Category</Text>
        </TouchableOpacity>
      </View>
      
      {/* Note for category grouping */}
      {groupByCategory && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: Milling and other services are grouped together under "Service" category.
          </Text>
        </View>
      )}
      
      {/* Empty state when no sales data */}
      {!hasData && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No sales data for the selected period.</Text>
        </View>
      )}
      
      {/* Empty state when all items have unknown cost */}
      {allCostUnknown && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Set buying prices in Inventory to see real profit numbers
          </Text>
        </View>
      )}
      
      {/* Table Header and Table (only show if we have data and not all cost unknown)}}
      {!allCostUnknown && hasData && (
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Item Profitability</Text>
          </View>
          
          {/* Table */}
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>{groupByCategory ? 'Category' : 'Name'}</Text>
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  toggleButtonTextActive: {
    color: Colors.onPrimary,
  },
  noteContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  noteText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
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