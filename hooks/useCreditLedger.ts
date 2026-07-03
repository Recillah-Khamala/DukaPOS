import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CreditEntry = {
  id: string;
  customerId: string;
  customerName: string;
  items: { name: string; qty: number; unitPrice: number; total: number }[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  createdAt: string;
  lastUpdatedAt: string;
  status: 'active' | 'paid';
};

const LEDGER_KEY = 'duka_credit_ledger';

export const useCreditLedger = () => {
  const [entries, setEntries] = useState<CreditEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(LEDGER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CreditEntry[];
          setEntries(parsed);
        }
      } catch (e) {
        console.warn('Failed to load credit ledger:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addEntry = async (entry: CreditEntry) => {
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    try {
      await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.warn('Failed to save credit ledger:', e);
    }
  };

  const updateEntry = (updatedEntry: CreditEntry) => {
    const newEntries = entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
    setEntries(newEntries);
    try {
      await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.warn('Failed to save credit ledger:', e);
    }
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    try {
      await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.warn('Failed to save credit ledger:', e);
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
};