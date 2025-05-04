
// Define allowed table names to satisfy TypeScript
export type TableName = 'categories' | 'products' | 'profiles' | 'orders' | 'order_items';

export const AVAILABLE_TABLES = [
  { id: 'products', name: 'Products' },
  { id: 'categories', name: 'Categories' },
  { id: 'profiles', name: 'User Profiles' },
  { id: 'orders', name: 'Orders' },
];

// Type guard to ensure tableName is one of the allowed values
export const isValidTable = (name: string): name is TableName => {
  return ['categories', 'products', 'profiles', 'orders', 'order_items'].includes(name);
};
