import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Customer } from '../types';
import { loadData, saveData } from '../utils/storage';
import { randomUUID } from 'expo-crypto';

const CUSTOMERS_KEY = 'duka_customers';

interface CustomersContextValue {
  customers: Customer[];
  loading: boolean;
  // Returns the created Customer (including its generated id) so callers
  // that need to use the customer immediately (e.g. attaching a credit
  // entry to them) don't have to separately generate their own id and risk
  // it diverging from the one actually persisted here.
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  // Bulk-add customers that already have a fixed id — used by the one-time
  // legacy customerId migration, which must preserve each old CreditEntry's
  // existing customerId rather than mint a new random one. Also avoids the
  // stale-closure race of calling addCustomer() repeatedly in a loop (each
  // call would otherwise persist against the same pre-loop `customers`
  // snapshot, silently dropping all but the last addition).
  addCustomers: (newCustomers: Customer[]) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextValue | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await loadData<Customer[]>(CUSTOMERS_KEY);
        if (saved && Array.isArray(saved)) {
          setCustomers(saved);
        }
      } catch (e) {
        console.error('Failed to load customers from storage:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persist = async (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    await saveData(CUSTOMERS_KEY, newCustomers);
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    const newCustomer: Customer = {
      id: (await randomUUID()).toString(),
      name: customerData.name,
      createdAt: new Date().toISOString(),
    };
    await persist([...customers, newCustomer]);
    return newCustomer;
  };

  const addCustomers = async (newCustomers: Customer[]) => {
    if (newCustomers.length === 0) return;
    await persist([...customers, ...newCustomers]);
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        addCustomer,
        addCustomers,
        getCustomerById,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return ctx;
}