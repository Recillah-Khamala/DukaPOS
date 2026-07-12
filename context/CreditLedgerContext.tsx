// context/CreditLedgerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const CreditLedgerContext = createContext();
const CREDIT_LEDGER_KEY = 'duka_credit_ledger';

export const useCreditLedger = () => useContext(CreditLedgerContext);
export const CreditLedgerProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLedger = async () => {
      const saved = await loadData(CREDIT_LEDGER_KEY);
      if (saved && Array.isArray(saved.entries)) {
        setEntries(saved.entries);
      }
      setLoading(false);
    };
    loadLedger();
  }, []);

  const addEntry = async (entry) => {
    setEntries(prev => {
      const newEntries = [...prev, entry];
      saveData(CREDIT_LEDGER_KEY, { entries: newEntries });
      return newEntries;
    });
  };

  const recordPayment = async (customerId, amount) => {
    // Implementation would update entries and then save
    setEntries(prev => {
      // ... logic to update entries with payment ...
      const updated = [...prev]; // placeholder
      saveData(CREDIT_LEDGER_KEY, { entries: updated });
      return updated;
    });
  };

  // ... other functions like updateEntry, etc. would also save after state update

  return (
    <CreditLedgerContext.Provider value={{ entries, addEntry, recordPayment, /* ... */, loading }}>
      {children}
    </CreditLedgerContext.Provider>
  );
};