import { useState, useMemo } from 'react';
import type { Product } from '../types';

export type GroupedProducts = Record<string, Product[]>;

export function useProductSearch(products: Product[], initialCategory = 'All') {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Query filter (name or category, case-insensitive)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, query, selectedCategory]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce<GroupedProducts>((acc, product) => {
      const key = product.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return { query, setQuery, selectedCategory, setSelectedCategory, filteredProducts, groupedProducts };
}
