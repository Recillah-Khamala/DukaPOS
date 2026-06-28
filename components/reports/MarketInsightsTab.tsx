import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const MarketInsightsTab: React.FC = () => {
  const demandItems = [
    { name: 'Maize', icon: 'grass', percent: 88, note: 'Kitale: +24% vs National' },
    { name: 'Millet', icon: 'eco', percent: 62, note: 'Kitale: +8% vs National' },
    { name: 'Sorghum', icon: 'grain', percent: 45, note: 'Kitale: -4% vs National' },
  ];

  const topShops = [
    { initials: 'WM', name: 'Wekesa Millers', tag: 'High Volume', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'KM', name: 'Kitale Maize Hub', tag: 'Steady Repayment', icon: 'trending-up', iconColor: Colors.primary },
    { initials: 'CP', name: 'Cherangani Posho', tag: 'Peak Season Growth', icon: 'star', iconColor: Colors.secondary },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Insights & Analytics</Text>

      {/* 4 Stat Cards */}
      <View style={styles.statCards}>
        {[
          { label: 'Regional Avg Price', value: 'KES 128/kg', icon: 'trending-up', iconColor: '#16a34a' },
          { label: 'Active Traders', value: '142 Shops', icon: 'store', iconColor: Colors.primary },
          { label: 'Top Commodity', value: 'Maize', icon: 'grass', iconColor: Colors.secondary },
          { label: 'Market Demand', value: '+12% this week', icon: 'trending-up', iconColor: '#16a34a' },
        ].map((card) => (
          <View key={card.label} style={styles.statCard}>
            <MaterialIcons name={card.icon as any} size={24} color={card.iconColor} />
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {/* Kitale Hub Activity */}
      <Text style={styles.sectionTitle}>Kitale Hub Activity</Text>
      <Text style={styles.sectionSubtitle}>Heatmap based on Posho Mill throughput</Text>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={48} color={Colors.outlineVariant} />
        <Text style={styles.mapText}>Live map coming soon</Text>
      </View>

      {/* Demand by Commodity */}
      <Text style={styles.sectionTitle}>Demand by Commodity</Text>
      {demandItems.map((item) => (
        <View key={item.name} style={styles.demandItem}>
          <View style={styles.demandLabelContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name={item.icon as any} size={18} color={Colors.secondary} />
              <Text style={styles.demandName}>{item.name}</Text>
            </View>
            <Text style={styles.demandNote}>{item.note}</Text>
          </View>
          <View style={styles.demandBarBackground}>
            <View style={{ width: `${item.percent}%`, height: 8, backgroundColor: Colors.primary, borderRadius: 4 }} />
          </View>
        </View>
      ))}

      {/* Top Shops */}
      <Text style={styles.sectionTitle}>Top Shops in Kitale</Text>
      {topShops.map((shop) => (
        <View key={shop.name} style={styles.shopCard}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Text style={styles.shopInitials}>{shop.initials}</Text>
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.shopTag}>{shop.tag}</Text>
          </View>
          <MaterialIcons name={shop.icon as any} size={24} color={shop.iconColor} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 16,
  },
  statCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  statValue: {
    color: Colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  mapPlaceholder: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mapText: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginTop: 8,
  },
  demandItem: {
    marginBottom: 16,
  },
  demandLabelContainer: {
    marginBottom: 6,
  },
  demandName: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  demandNote: {
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  demandBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 4,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  shopInitials: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  shopName: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '700',
  },
  shopTag: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  shopInfo: {
    flex: 1,
    marginLeft: 12,
  },
});

export default MarketInsightsTab;