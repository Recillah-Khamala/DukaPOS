import { useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';
import { INVENTORY_ITEMS } from '../constants/inventoryData';
import type { InventoryItem } from '../constants/inventoryData';

const INVENTORY_KEY = 'duka_inventory';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const loadInventory = async () => {
      const saved = await loadData<InventoryItem[]>(INVENTORY_KEY);
      if (saved) {
        setItems(saved);
      } else {
        setItems(INVENTORY_ITEMS);
        await saveData(INVENTORY_KEY, INVENTORY_ITEMS);
      }
    };
    loadInventory();
  }, []);

  const updateItem = async (updatedItem: InventoryItem) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === updatedItem.id ? updatedItem : item);
      saveData(INVENTORY_KEY, updated).catch(console.error);
      return updated;
    });
  };

  return { items, updateItem };
}