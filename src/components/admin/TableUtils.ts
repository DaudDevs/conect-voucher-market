
// Define allowed table names to satisfy TypeScript
export type TableName = 'categories' | 'products' | 'profiles' | 'orders' | 'order_items';

export const AVAILABLE_TABLES = [
  { id: 'products' as TableName, name: 'Products' },
  { id: 'categories' as TableName, name: 'Categories' },
  { id: 'profiles' as TableName, name: 'User Profiles' },
  { id: 'orders' as TableName, name: 'Orders' },
];

// Type guard to ensure tableName is one of the allowed values
export const isValidTable = (name: string): name is TableName => {
  return ['categories', 'products', 'profiles', 'orders', 'order_items'].includes(name);
};
