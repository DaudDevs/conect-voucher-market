
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { TableName, isValidTable } from './TableUtils';

interface DataFormProps {
  tableName: TableName;
  initialData?: any;
  isEditing?: boolean;
  onSuccess: () => void;
}

interface FieldConfig {
  type: string;
  required?: boolean;
}

interface TableSchema {
  [key: string]: FieldConfig;
}

export function DataForm({ tableName, initialData, isEditing = false, onSuccess }: DataFormProps) {
  // Get table schema to generate form fields dynamically
  const { data: tableSchema } = useQuery({
    queryKey: ['table-schema', tableName],
    queryFn: async () => {
      // This is a simplified approach - in a real app you might want to get this from your types
      // or create a dedicated endpoint for schema information
      
      // For now, let's just infer the schema based on available data or provide defaults
      if (initialData) {
        // Infer from existing data
        return Object.entries(initialData).reduce((schema: TableSchema, [key, value]) => {
          // Skip certain system fields
          if (['id', 'created_at', 'updated_at'].includes(key)) return schema;
          
          const fieldType = typeof value;
          schema[key] = { type: fieldType };
          return schema;
        }, {} as TableSchema);
      }
      
      // Provide default schema based on table name
      switch (tableName) {
        case 'products':
          return {
            name: { type: 'string', required: true },
            price: { type: 'number', required: true },
            description: { type: 'string' },
            category_id: { type: 'string', required: true },
            duration: { type: 'string', required: true },
            is_popular: { type: 'boolean' },
            discount: { type: 'number' },
            image: { type: 'string' }
          } as TableSchema;
        case 'categories':
          return {
            name: { type: 'string', required: true },
            slug: { type: 'string', required: true },
            image: { type: 'string' }
          } as TableSchema;
        case 'profiles':
          return {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            role: { type: 'string', required: true }
          } as TableSchema;
        default:
          return {} as TableSchema;
      }
    },
  });

  // Fetch reference data for select fields
  const { data: categories } = useQuery({
    queryKey: ['categories-for-select'],
    queryFn: async () => {
      if (tableName === 'products') {
        const { data } = await supabase.from('categories').select('id, name');
        return data || [];
      }
      return [];
    },
    enabled: tableName === 'products',
  });

  // Generate a dynamic Zod schema based on the table schema
  const generateZodSchema = () => {
    if (!tableSchema) return z.object({});
    
    const schemaObj: any = {};
    
    Object.entries(tableSchema).forEach(([key, field]: [string, FieldConfig]) => {
      let fieldSchema;
      
      if (field.type === 'string') {
        fieldSchema = field.required ? z.string().min(1, `${key} is required`) : z.string().optional();
      } else if (field.type === 'number') {
        fieldSchema = field.required ? z.coerce.number().min(0) : z.coerce.number().optional();
      } else if (field.type === 'boolean') {
        fieldSchema = z.boolean().default(false);
      } else {
        fieldSchema = z.any();
      }
      
      schemaObj[key] = fieldSchema;
    });
    
    return z.object(schemaObj);
  };

  const formSchema = generateZodSchema();
  
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData && isEditing) {
      const formValues = { ...initialData };
      // Remove fields we don't want to edit directly
      delete formValues.id;
      delete formValues.created_at;
      delete formValues.updated_at;
      form.reset(formValues);
    }
  }, [initialData, isEditing, form]);

  // Form submission handler
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (!isValidTable(tableName)) {
        throw new Error(`Invalid table name: ${tableName}`);
      }

      if (isEditing && initialData?.id) {
        // Update existing record
        const { error } = await supabase
          .from(tableName)
          .update(values)
          .eq('id', initialData.id);
          
        if (error) throw error;
        return { ...values, id: initialData.id };
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from(tableName)
          .insert(values)
          .select();
          
        if (error) throw error;
        return data?.[0];
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Record updated successfully' : 'Record created successfully');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error saving record:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} record: ${error.message}`);
    },
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values);
  };

  if (!tableSchema) return <div>Loading form...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {Object.entries(tableSchema).map(([key, fieldConfig]: [string, FieldConfig]) => (
          <FormField
            key={key}
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{key.replace('_', ' ')}</FormLabel>
                <FormControl>
                  {(() => {
                    if (key === 'category_id' && tableName === 'products') {
                      // Special case for category selection
                      return (
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    } else if (key === 'role' && tableName === 'profiles') {
                      // Role selection
                      return (
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="customer">customer</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    } else if (key === 'duration' && tableName === 'products') {
                      // Duration selection
                      return (
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1 Day">1 Day</SelectItem>
                            <SelectItem value="2 Days">2 Days</SelectItem>
                            <SelectItem value="7 Days">7 Days</SelectItem>
                            <SelectItem value="14 Days">14 Days</SelectItem>
                            <SelectItem value="30 Days">30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    } else if (fieldConfig.type === 'boolean') {
                      // Boolean checkbox
                      return (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm text-gray-500">Enable this option</span>
                        </div>
                      );
                    } else if (key === 'description') {
                      // Text area for descriptions
                      return (
                        <Textarea
                          {...field}
                          placeholder={`Enter ${key.replace('_', ' ')}`}
                          rows={4}
                        />
                      );
                    } else if (fieldConfig.type === 'number') {
                      // Number input
                      return (
                        <Input
                          type="number"
                          {...field}
                          placeholder={`Enter ${key.replace('_', ' ')}`}
                        />
                      );
                    } else {
                      // Default text input
                      return (
                        <Input
                          {...field}
                          placeholder={`Enter ${key.replace('_', ' ')}`}
                        />
                      );
                    }
                  })()}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEditing ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
