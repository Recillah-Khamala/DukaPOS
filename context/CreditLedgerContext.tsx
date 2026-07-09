import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CreditItemCategory = 'cereal' | 'milling' | 'bags' | 'other';

export type CreditItem = {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
  category?: CreditItemCategory;
  amountPaid?: number;
  balance?: number;
  productId?: string;
  unit?: string;
};

export type CreditEntry = {
  id: string;
  customerId: string;
  customerName: string;
  items: CreditItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  createdAt: string;
  lastUpdatedAt: string;
  status: 'active' | 'paid';
};

const LEDGER_KEY = 'duka_credit_ledger';

// Backfills item-level fields for entries created before partial-payment support existed.
const normalizeEntry = (entry: CreditEntry): CreditEntry => ({
  ...entry,
  items: entry.items.map((item) => ({
    ...item,
    category: item.category ?? 'other',
    amountPaid: item.amountPaid ?? (entry.status === 'paid' ? item.total : 0),
    balance: item.balance ?? (entry.status === 'paid' ? 0 : item.total),
  })),
});

// Splits a payment across a set of items proportionally to each item's
// remaining balance. Last outstanding item absorbs any rounding remainder
// so the total always reconciles exactly.
// Exported so it can be reused both for later repayments (recordPayment)
// and for an upfront deposit taken at the moment a credit entry is created.
export const allocatePaymentToItems = (items: CreditItem[], payAmount: number): CreditItem[] => {
  const itemsWithBalance = items.map((item) => ({
    ...item,
    balance: item.balance ?? item.total,
    amountPaid: item.amountPaid ?? 0,
  }));

  const totalOutstanding = itemsWithBalance.reduce((sum, i) => sum + (i.balance ?? 0), 0);
  if (totalOutstanding <= 0) return itemsWithBalance;

  let remaining = payAmount;
  const outstandingIndices = itemsWithBalance
    .map((item, idx) => ({ idx, balance: item.balance ?? 0 }))
    .filter((x) => x.balance > 0);

  return itemsWithBalance.map((item, idx) => {
    const isLastOutstanding = outstandingIndices[outstandingIndices.length - 1]?.idx === idx;
    if ((item.balance ?? 0) <= 0) return item;

    const share = (item.balance ?? 0) / totalOutstanding;
    let itemPayment = isLastOutstanding ? remaining : Math.min(payAmount * share, item.balance ?? 0);
    itemPayment = Math.max(0, Math.min(itemPayment, item.balance ?? 0));
    remaining -= itemPayment;

    return {
      ...item,
      amountPaid: (item.amountPaid ?? 0) + itemPayment,
      balance: Math.max(0, (item.balance ?? 0) - itemPayment),
    };
  });
};

interface CreditLedgerContextValue {
  entries: CreditEntry[];
  loading: boolean;
  addEntry: (entry: CreditEntry) => Promise<void>;
  updateEntry: (updatedEntry: CreditEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  recordPayment: (customerId: string, amount: number) => Promise<void>;
}

const CreditLedgerContext = createContext<CreditLedgerContextValue | undefined>(undefined);

export function CreditLedgerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CreditEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(LEDGER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CreditEntry[];
          setEntries(parsed.map(normalizeEntry));
        }
      } catch (e) {
        console.warn('Failed to load credit ledger:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persist = async (newEntries: CreditEntry[]) => {
    setEntries(newEntries);
    try {
      await AsyncStorage.setItem(LEDGER_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.warn('Failed to save credit ledger:', e);
    }
  };

  const addEntry = async (entry: CreditEntry) => {
    await persist([normalizeEntry(entry), ...entries]);
  };

  const updateEntry = async (updatedEntry: CreditEntry) => {
    await persist(entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)));
  };

  const deleteEntry = async (id: string) => {
    await persist(entries.filter((e) => e.id !== id));
  };

  // Applies a payment across a customer's active entries, oldest first (FIFO),
  // splitting proportionally across each entry's line items.
  const recordPayment = async (customerId: string, amount: number) => {
    if (amount <= 0) return;

    const activeEntries = entries
      .filter((e) => e.customerId === customerId && e.status === 'active')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let remaining = amount;
    const updatedById: Record<string, CreditEntry> = {};

    for (const entry of activeEntries) {
      if (remaining <= 0) break;
      const payForEntry = Math.min(remaining, entry.balance);
      if (payForEntry <= 0) continue;

      const updatedItems = allocatePaymentToItems(entry.items, payForEntry);
      const newAmountPaid = entry.amountPaid + payForEntry;
      const newBalance = Math.max(0, entry.balance - payForEntry);

      updatedById[entry.id] = {
        ...entry,
        items: updatedItems,
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newBalance <= 0.01 ? 'paid' : 'active',
        lastUpdatedAt: new Date().toISOString(),
      };

      remaining -= payForEntry;
    }

    const newEntries = entries.map((e) => updatedById[e.id] ?? e);
    await persist(newEntries);
  };

  return (
    <CreditLedgerContext.Provider
      value={{
        entries,
        loading,
        addEntry,
        updateEntry,
        deleteEntry,
        recordPayment,
      }}
    >
      {children}
    </CreditLedgerContext.Provider>
  );
}

export function useCreditLedger() {
  const ctx = useContext(CreditLedgerContext);
  if (!ctx) {
    throw new Error('useCreditLedger must be used within a CreditLedgerProvider');
  }
  return ctx;
}