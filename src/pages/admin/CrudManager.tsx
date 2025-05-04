
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataForm } from '@/components/admin/DataForm';
import { AVAILABLE_TABLES, TableName } from '@/components/admin/TableUtils';
import { CrudTable } from '@/components/admin/CrudTable';
import { ViewItemDialog } from '@/components/admin/ViewItemDialog';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { useCrudOperations } from '@/hooks/useCrudOperations';

const CrudManager = () => {
  const [selectedTable, setSelectedTable] = useState<TableName>('products');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  
  const {
    items,
    isLoading,
    refetch,
    columns,
    itemToDelete,
    setItemToDelete,
    handleDeleteItem
  } = useCrudOperations(selectedTable, searchTerm);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CRUD Manager</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Table</label>
          <Select
            value={selectedTable} 
            onValueChange={(value: TableName) => setSelectedTable(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_TABLES.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Input
            placeholder={`Search in ${selectedTable}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <CrudTable
        columns={columns}
        items={items}
        isLoading={isLoading}
        onView={(item) => {
          setSelectedItem(item);
          setIsViewDialogOpen(true);
        }}
        onEdit={(item) => {
          setSelectedItem(item);
          setIsEditDialogOpen(true);
        }}
        onDelete={(id) => setItemToDelete(id)}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New {selectedTable.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <DataForm
            tableName={selectedTable}
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <ViewItemDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        item={selectedItem}
        tableName={selectedTable}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit {selectedTable.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <DataForm
            tableName={selectedTable}
            initialData={selectedItem}
            isEditing={true}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
};

export default CrudManager;
