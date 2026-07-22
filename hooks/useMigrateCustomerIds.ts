import { useEffect, useRef } from 'react';
import { useCreditLedger } from './useCreditLedger';
import { useCustomers } from '../context/CustomersContext';
import type { Customer } from '../types';

// One-time backfill: any CreditEntry whose customerId has no matching
// Customer record (i.e. entries created before the Customer entity existed,
// keyed by the old makeCustomerId slug) gets a Customer record created for
// it — using the entry's existing customerId as-is and its customerName as
// the name. No CreditEntry rows are rewritten; old entries keep the id they
// already have. This just ensures every customerId referenced anywhere in
// the ledger has a corresponding Customer going forward.
//
// Uses addCustomers (bulk) rather than looping addCustomer() calls, since
// addCustomer always mints its own random id — incompatible with preserving
// a specific legacy id — and a loop of individual persists would race
// against a stale `customers` snapshot anyway.
//
// Call this once near the app root, after both CreditLedgerProvider and
// CustomersProvider are mounted (see app/_layout.tsx).
export function useMigrateCustomerIds() {
  const { entries, loading: entriesLoading } = useCreditLedger();
  const { customers, loading: customersLoading, addCustomers, getCustomerById } = useCustomers();
  const hasRun = useRef(false);

  useEffect(() => {
    if (entriesLoading || customersLoading || hasRun.current) return;
    hasRun.current = true;

    const missingById = new Map<string, string>(); // customerId -> customerName

    entries.forEach(entry => {
      if (!getCustomerById(entry.customerId) && !missingById.has(entry.customerId)) {
        missingById.set(entry.customerId, entry.customerName);
      }
    });

    if (missingById.size === 0) return;

    const now = new Date().toISOString();
    const backfilled: Customer[] = Array.from(missingById.entries()).map(([id, name]) => ({
      id,
      name,
      createdAt: now,
    }));

    addCustomers(backfilled);
  }, [entries, customers, entriesLoading, customersLoading, addCustomers, getCustomerById]);
}