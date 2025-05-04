
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface CrudTableProps {
  columns: string[];
  items: any[] | null;
  isLoading: boolean;
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function CrudTable({ columns, items, isLoading, onView, onEdit, onDelete }: CrudTableProps) {
  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.slice(0, 4).map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(5)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items?.map((item) => (
              <TableRow key={item.id}>
                {columns.slice(0, 4).map((column) => (
                  <TableCell key={column}>
                    {typeof item[column] === 'boolean' 
                      ? item[column] ? 'Yes' : 'No'
                      : String(item[column]).substring(0, 40)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(item)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
