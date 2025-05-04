
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['admin-customers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id);
      
      if (error) throw error;
      return { id, role };
    },
    onSuccess: (data) => {
      toast.success(`User role has been set to "${data.role}".`);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error("Failed to update user role.");
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Customers</h1>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 max-w-sm">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost"
              onClick={() => setSearchTerm('')}
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers?.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {(customer.first_name || customer.last_name) ? 
                      `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : 
                      <span className="text-gray-400">No name</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={customer.role} 
                      onValueChange={(value) => handleRoleChange(customer.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">customer</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info("Feature coming soon", {
                          description: "Customer detail view will be available soon."
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
