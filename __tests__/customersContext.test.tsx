import { act, renderHook } from '@testing-library/react';
import { CustomersProvider, useCustomers } from '../context/CustomersContext';
import { Customer } from '../types';
import { loadData, saveData } from '../utils/storage';

// Mock the storage functions
jest.mock('../utils/storage', () => ({
  loadData: jest.fn(),
  saveData: jest.fn(),
}));

// Must be at module scope (not inside a test body) to be hoisted above
// CustomersContext.tsx's own `import { randomUUID } from 'expo-crypto'` —
// jest.mock() calls only hoist to the top of their *own* enclosing function,
// so one written inside an it() block never reaches the top-level import in
// another file and silently does nothing.
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn().mockResolvedValue('test-uuid-123'),
}));

const mockedLoadData = loadData as jest.Mock;
const mockedSaveData = saveData as jest.Mock;

describe('CustomersContext', () => {
  const wrap = ({ children }: { children: React.ReactNode }) => (
    <CustomersProvider>{children}</CustomersProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with an empty customer list and loading state', async () => {
    mockedLoadData.mockResolvedValueOnce(undefined); // Simulate no existing data

    // FIX: renderHook() returns { result: { current: T }, ... } — the
    // *outer* object is not itself the current value. Destructuring
    // `{ result }` here and reading `result.current` below matches that
    // shape. The previous version assigned the whole renderHook() return
    // value to a variable also named `result` and read `.current` directly
    // on it, which is `undefined` on that outer object — every assertion
    // in this file was silently checking `undefined.loading` etc.
    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.customers).toEqual([]);
    expect(mockedLoadData).toHaveBeenCalledWith('duka_customers');
  });

  it('should load existing customers from storage', async () => {
    const existingCustomers: Customer[] = [
      { id: '1', name: 'Customer 1', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', name: 'Customer 2', createdAt: '2024-01-02T00:00:00.000Z' },
    ];
    mockedLoadData.mockResolvedValueOnce(existingCustomers);

    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    expect(result.current.customers).toEqual(existingCustomers);
    expect(mockedLoadData).toHaveBeenCalledWith('duka_customers');
  });

  it('should add a new customer, return it, and update state', async () => {
    mockedLoadData.mockResolvedValueOnce([]); // Start with empty list

    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    // Act: add a customer
    let created!: Customer;
    await act(async () => {
      created = await result.current.addCustomer({ name: 'New Customer' });
    });

    // Assert: the created customer is returned directly (callers rely on
    // this to get the real persisted id without generating their own)
    expect(created).toMatchObject({
      id: 'test-uuid-123',
      name: 'New Customer',
    });
    expect(typeof created.createdAt).toBe('string');

    // Assert: state updated
    expect(result.current.customers).toHaveLength(1);
    expect(result.current.customers[0]).toMatchObject({
      id: 'test-uuid-123',
      name: 'New Customer',
    });
    expect(mockedSaveData).toHaveBeenCalledWith(
      'duka_customers',
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-uuid-123',
          name: 'New Customer',
        })
      ])
    );
  });

  it('should bulk-add customers with pre-set ids via addCustomers', async () => {
    mockedLoadData.mockResolvedValueOnce([]); // Start with empty list

    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    const legacyCustomers: Customer[] = [
      { id: 'mama-njeri', name: 'Mama Njeri', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 'john-kamau', name: 'John Kamau', createdAt: '2024-01-02T00:00:00.000Z' },
    ];

    await act(async () => {
      await result.current.addCustomers(legacyCustomers);
    });

    // Ids are preserved exactly as given — no new id is generated — which
    // is what the legacy customerId migration depends on.
    expect(result.current.customers).toEqual(
      expect.arrayContaining(legacyCustomers)
    );
    expect(mockedSaveData).toHaveBeenCalledWith(
      'duka_customers',
      expect.arrayContaining(legacyCustomers)
    );
  });

  it('should get a customer by id', async () => {
    const testCustomer: Customer = {
      id: 'test-id',
      name: 'Test Customer',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    mockedLoadData.mockResolvedValueOnce([testCustomer]);

    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    const found = result.current.getCustomerById('test-id');
    expect(found).toEqual(testCustomer);

    const notFound = result.current.getCustomerById('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('should handle storage errors gracefully', async () => {
    mockedLoadData.mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useCustomers(), { wrapper: wrap });
    await act(async () => {});

    // Even if loading fails, we should still have a loading state that turns to false
    // and an empty customer list (as per the current implementation)
    expect(result.current.loading).toBe(false);
    expect(result.current.customers).toEqual([]);
  });
});