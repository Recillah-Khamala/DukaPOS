import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Customer } from '../types';
import { loadData, saveData } from '../utils/storage';
import { randomUUID } from 'expo-crypto';

const CUSTOMERS_KEY = 'duka_customers';

interface CustomersContextValue {
  customers: Customer[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextValue | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      const saved = await loadData<Customer[]>(CUSTOMERS_KEY);
      if (saved && Array.isArray(saved)) {
        setCustomers(saved);
      }
      setLoading(false);
    };
    load();
  }, []);

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      id: (await randomUUID()).toString(),
      name: customerData.name,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
    await saveData(CUSTOMERS_KEY, [...customers, newCustomer]);
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
