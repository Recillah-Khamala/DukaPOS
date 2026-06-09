import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompletedSale, PaymentMethod, BasketItem } from '../types';

const HISTORY_KEY = 'duka_sales_history';

export function useSalesHistory() {
  const [sales, setSales] = useState<CompletedSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CompletedSale[];
          if (!cancelled) setSales(parsed);
        }
      } catch (e) {
        console.warn('Failed to load sales history:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addSale = async (sale: CompletedSale) => {
    const next = [sale, ...sales];
    setSales(next);
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save sale:', e);
    }
  };

  const clearHistory = async () => {
    setSales([]);
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear sales history:', e);
    }
  };

  return { sales, salesHistory: sales, loading, addSale, clearHistory };
}
