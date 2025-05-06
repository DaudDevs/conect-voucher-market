
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: {
    id: string;
    name: string;
    duration: string;
    price: number;
    discount: number;
    quantity: number;
  };
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItemRow = ({ item, updateQuantity, removeItem }: CartItemRowProps) => {
  const discountedPrice = item.discount
    ? Math.round(item.price * (1 - item.discount / 100))
    : item.price;

  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{item.duration}</TableCell>
      <TableCell>
        {discountedPrice.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        })}
        
        {item.discount > 0 && (
          <div className="text-xs text-muted-foreground line-through">
            {item.price.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            })}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
            className="w-14 h-8 mx-2 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell>
        {(discountedPrice * item.quantity).toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        })}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItemRow;
