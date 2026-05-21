import { useState, useMemo } from 'react';
import type { Product } from '../types';

export type GroupedProducts = Record<string, Product[]>;

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce<GroupedProducts>((acc, product) => {
      const key = product.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return { query, setQuery, filteredProducts, groupedProducts };
}
