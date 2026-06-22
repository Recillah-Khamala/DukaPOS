/// <reference types="jest" />
import { renderHook, act } from '@testing-library/react';
import { useBasket } from '../hooks/useBasket';

describe('useBasket', () => {
  it('addItem with qty=0.25 adds item correctly', () => {
    const { result } = renderHook(() => useBasket());
    
    act(() => {
      result.current.addItem({
        id: 'item_1',
        productId: 'prod_1',
        name: 'Test Cereal',
        qty: 0.25,
        unitPrice: 100,
        type: 'cereal',
      });
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(0.25);
  });

  it('updateItemQty updates quantity by productId', () => {
    const { result } = renderHook(() => useBasket());
    
    act(() => {
      result.current.addItem({
        id: 'item_1',
        productId: 'prod_1',
        name: 'Test Cereal',
        qty: 1,
        unitPrice: 100,
        type: 'cereal',
      });
    });
    
    act(() => {
      result.current.updateItemQty('prod_1', 2);
    });
    
    expect(result.current.items[0].qty).toBe(2);
  });

  it('adding same product twice accumulates quantity instead of duplicating entry', () => {
    const { result } = renderHook(() => useBasket());
    
    act(() => {
      result.current.addItem({
        id: 'item_1',
        productId: 'prod_1',
        name: 'Test Cereal',
        qty: 1,
        unitPrice: 100,
        type: 'cereal',
      });
      result.current.addItem({
        id: 'item_2',
        productId: 'prod_1',
        name: 'Test Cereal',
        qty: 0.5,
        unitPrice: 100,
        type: 'cereal',
      });
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(1.5);
  });

  it('adding different products creates separate entries', () => {
    const { result } = renderHook(() => useBasket());
    
    act(() => {
      result.current.addItem({
        id: 'item_1',
        productId: 'prod_1',
        name: 'Cereal A',
        qty: 1,
        unitPrice: 100,
        type: 'cereal',
      });
      result.current.addItem({
        id: 'item_2',
        productId: 'prod_2',
        name: 'Cereal B',
        qty: 2,
        unitPrice: 50,
        type: 'cereal',
      });
    });
    
    expect(result.current.items).toHaveLength(2);
  });

  it('total calculates correctly', () => {
    const { result } = renderHook(() => useBasket());
    
    act(() => {
      result.current.addItem({
        id: 'item_1',
        productId: 'prod_1',
        name: 'Test Cereal',
        qty: 2,
        unitPrice: 100,
        type: 'cereal',
      });
    });
    
    expect(result.current.total).toBe(200);
  });
});
