import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FuelEntry = {
  id: string;
  date: string; // ISO string
  fuelType: 'diesel' | 'electricity';
  quantity: number; // litres or kWh
  costPerUnit: number; // KES per litre or KES per kWh
  totalCost: number; // quantity * costPerUnit
  note?: string;
};

const STORAGE_KEY = 'duka_fuel_log';

export const useFuelLog = () => {
  const [entries, setEntries] = useState<FuelEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: FuelEntry[] = JSON.parse(stored);
          setEntries(parsed);
        }
      } catch (e) {
        console.error('Failed to load fuel log', e);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Save entries to AsyncStorage
  const saveEntries = useCallback(async (entriesToSave: FuelEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entriesToSave));
    } catch (e) {
      console.error('Failed to save fuel log', e);
    }
  }, []);

  // Add a new entry (prepend)
  const addEntry = useCallback(async (newEntry: FuelEntry) => {
    setLoading(true);
    try {
      const updated = [newEntry, ...entries];
      setEntries(updated);
      await saveEntries(updated);
    } finally {
      setLoading(false);
    }
  }, [entries, saveEntries]);

  // Delete entry by id
  const deleteEntry = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updated = entries.filter((entry) => entry.id !== id);
      setEntries(updated);
      await saveEntries(updated);
    } finally {
      setLoading(false);
    }
  }, [entries, saveEntries]);

  return { entries, loading, addEntry, deleteEntry };
};