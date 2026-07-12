// context/InventoryContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { useDynamicProducts } from '../context/DynamicProductsContext';
import inventoryData from '../constants/inventoryData';

const InventoryContext = createContext();
const SEED_OVERRIDES_KEY = 'duka_inventory_overrides';

export const useInventory = () => useContext(InventoryContext);
export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(inventoryData);
  const [seedOverrides, setSeedOverrides] = useState({});
  const [seedOverridesLoading, setSeedOverridesLoading] = useState(true);
  const { loading: dynamicProductsLoading = false } = useDynamicProducts() || {};
  const loading = seedOverridesLoading || dynamicProductsLoading;

  useEffect(() => {
    const loadSeedOverrides = async () => {
      const saved = await loadData(SEED_OVERRIDES_KEY);
      setSeedOverrides(typeof saved === 'object' && saved !== null ? saved : {});
      setSeedOverridesLoading(false);
    };
    loadSeedOverrides();
  }, []);

  // Apply seedOverrides to the inventory when seedOverrides change or loading completes
  useEffect(() => {
    if (!seedOverridesLoading) {
      const updatedInventory = inventoryData.map(item => {
        const override = seedOverrides[item.id];
        return override ? { ...item, ...override } : item;
      });
      setInventory(updatedInventory);
    }
  }, [seedOverrides, seedOverridesLoading]);

  const updateItem = (id, updates) => {
    setInventory(prev => {
      const newInventory = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      return newInventory;
    });

    // If this item is a seed item (exists in the original seed data), update the seedOverrides
    const isSeedItem = inventoryData.some(item => item.id === id);
    if (isSeedItem) {
      setSeedOverrides(prev => {
        const newOverrides = { ...prev, [id]: { ...prev[id], ...updates } };
        saveData(SEED_OVERRIDES_KEY, newOverrides);
        return newOverrides;
      });
    }
  };

  return (
    <InventoryContext.Provider value={{ inventory, setInventory, seedOverrides, setSeedOverrides, updateItem, loading }}>
      {children}
    </InventoryContext.Provider>
  );
};