
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ViewItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  tableName: string;
}

export function ViewItemDialog({ isOpen, onOpenChange, item, tableName }: ViewItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>View {tableName.slice(0, -1)}</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{key}</p>
                <p>{String(value)}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
