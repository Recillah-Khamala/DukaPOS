import type { Sale, BasketItem } from '../types';
import { mockProducts } from '../constants/mockProducts';

/**
 * Generates a random integer between min (inclusive) and max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random float between min (inclusive) and max (exclusive)
 */
const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generates a random date within the last 7 days (including today)
 */
const randomDateInLast7Days = (): Date => {
  const now = new Date();
  const daysAgo = randomInt(0, 6); // 0 to 6 days ago
  const hoursAgo = randomInt(0, 23);
  const minutesAgo = randomInt(0, 59);
  const secondsAgo = randomInt(0, 59);

  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  date.setSeconds(date.getSeconds() - secondsAgo);
  date.setMilliseconds(0); // We don't need milliseconds for consistency

  return date;
};

const ICON_MAP: Record<string, string> = {
  'Grains & Flour': 'local-flour-mill',
  'Cooking': 'local-dining',
  'Beverages': 'local-cafe',
  'Household': 'cleaning-services',
};

/**
 * Generates a random basket item from the shared mockProducts list
 */
const generateRandomBasketItem = (): BasketItem => {
  const product = mockProducts[randomInt(0, mockProducts.length - 1)];
  const qty = randomInt(1, 5); // 1 to 5 units
  const unitPrice = randomFloat(product.price, product.price * 1.2);

  // Round unitPrice to 2 decimal places for currency
  const roundedUnitPrice = Math.round(unitPrice * 100) / 100;

  return {
    id: product.id,
    name: product.name,
    unitPrice: roundedUnitPrice,
    qty,
    icon: ICON_MAP[product.category] || 'shopping-bag',
  };
};

/**
 * Generates a random payment method (cash or mpesa)
 */
const randomPaymentMethod = (): 'cash' | 'mpesa' => {
  return Math.random() > 0.5 ? 'cash' : 'mpesa';
};

/**
 * Seeds sample sales data for testing
 * Generates 20 sales spread across the last 7 days
 */
export function seedSampleSales(): Sale[] {
  const sales: Sale[] = [];

  // Generate 20 sales
  for (let i = 0; i < 20; i++) {
    // Generate a random number of items in the basket (1 to 4)
    const itemCount = randomInt(1, 4);
    const items: BasketItem[] = [];

    // Generate the basket items
    for (let j = 0; j < itemCount; j++) {
      items.push(generateRandomBasketItem());
    }

    // Calculate total from items
    const total = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

    // Round total to 2 decimal places
    const roundedTotal = Math.round(total * 100) / 100;

    // Create the sale
    const sale: Sale = {
      id: `sample-${Date.now()}-${i}`,
      items,
      total: roundedTotal,
      paymentMethod: randomPaymentMethod(),
      createdAt: randomDateInLast7Days(),
    };

    sales.push(sale);
  }

  // Sort sales by date (oldest first) for consistency
  sales.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return sales;
}