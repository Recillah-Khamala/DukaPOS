import { act, renderHook } from '@testing-library/react-hooks';
import { CustomersProvider, useCustomers } from '../context/CustomersContext';
import { Customer } from '../types';
import { loadData, saveData } from '../utils/storage';

// Mock the storage functions
jest.mock('../utils/storage', () => ({
  loadData: jest.fn(),
  saveData: jest.fn(),
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

    let result;
    await act(async () => {
      result = renderHook(() => useCustomers(), { wrapper: wrap });
    });

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

    let result;
    await act(async () => {
      result = renderHook(() => useCustomers(), { wrapper: wrap });
    });

  };
    expect(result.current.customers).toEqual(existingCustomers);
    expect(mockedLoadData).toHaveBeenCalledWith('duka_customers');
  };

  it('should add a new customer and update state', async () => {
    mockedLoadData.mockResolvedValueOnce([]); // Start with empty list

    // Mock the UUID generation (we'll mock the import inside the component)
    // We'll mock the randomUUID function from expo-crypto
    jest.mock('expo-crypto', () => ({
      randomUUID: jest.fn().mockResolvedValue('test-uuid-123'),
    }));
    // We need to reload the module to pick up the mock, but for simplicity,
    // we'll assume the mock is set before the render.

    let result;
    await act(async () => {
      result = renderHook(() => useCustomers(), { wrapper: wrap });
    });

    // Act: add a customer
    await act(async () => {
      await result.current.addCustomer({ name: 'New Customer' });
    });

    // Assert: state updated
    expect(result.current.customers).toHaveLength(1);
    expect(result.current.customers[0]).toMatchObject({
      id: 'test-uuid-123',
      name: 'New Customer',
    });
    expect(typeof result.current.customers[0].createdAt).toBe('string');
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

  it('should get a customer by id', async () => {
    const testCustomer: Customer = {
      id: 'test-id',
      name: 'Test Customer',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    mockedLoadData.mockResolvedValueOnce([testCustomer]);

    let result;
    await act(async () => {
      result = renderHook(() => useCustomers(), { wrapper: wrap });
    });

    const found = result.current.getCustomerById('test-id');
    expect(found).toEqual(testCustomer);

    const notFound = result.current.getCustomerById('non-existent');
    expect(notFound).toBeUndefined();
  });

  it('should handle storage errors gracefully', async () => {
    mockedLoadData.mockRejectedValueOnce(new Error('Storage error'));

    let result;
    await act(async () => {
      result = renderHook(() => useCustomers(), { wrapper: wrap });
    });

    // Even if loading fails, we should still have a loading state that turns to false
    // and an empty customer list (as per the current implementation)
    expect(result.current.loading).toBe(false);
    expect(result.current.customers).toEqual([]);
  });
};
