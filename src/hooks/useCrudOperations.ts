
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TableName, isValidTable } from '@/components/admin/TableUtils';

export function useCrudOperations(selectedTable: TableName, searchTerm: string) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Fetch data based on selected table
  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['crud-manager', selectedTable, searchTerm],
    queryFn: async () => {
      let query = supabase.from(selectedTable).select('*');
      
      if (searchTerm) {
        // For simplicity, we'll search in the 'name' column if it exists
        if (selectedTable === 'products' || selectedTable === 'categories') {
          query = query.ilike('name', `%${searchTerm}%`);
        } else if (selectedTable === 'profiles') {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isValidTable(selectedTable)) {
        throw new Error(`Invalid table name: ${selectedTable}`);
      }
      
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success(`Item successfully deleted`);
      refetch();
      setItemToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete item: ${error.message}`);
    }
  });

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  // Get column names for the selected table
  const getColumnNames = () => {
    if (items && items.length > 0) {
      return Object.keys(items[0]).filter(key => key !== 'created_at' && key !== 'updated_at');
    }
    return [];
  };

  const columns = items && items.length > 0 ? getColumnNames() : [];

  return {
    items,
    isLoading,
    refetch,
    columns,
    itemToDelete,
    setItemToDelete,
    handleDeleteItem
  };
}
