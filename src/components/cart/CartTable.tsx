
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CartItemRow from "./CartItemRow";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  duration: string;
}

interface CartTableProps {
  cart: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  calculateTotal: () => number;
  onCheckout: () => void;
  isAuthenticated: boolean;
}

const CartTable = ({
  cart,
  updateQuantity,
  removeItem,
  calculateTotal,
  onCheckout,
  isAuthenticated
}: CartTableProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </TableBody>
        <TableCaption className="mt-2">
          <div className="flex justify-end">
            <div className="w-72">
              <div className="flex justify-between py-2">
                <span>Total</span>
                <span className="font-semibold">
                  {calculateTotal().toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        </TableCaption>
      </Table>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
        
        <Button 
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </>
  );
};

export default CartTable;
