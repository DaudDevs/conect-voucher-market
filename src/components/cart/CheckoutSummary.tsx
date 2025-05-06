
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
}

interface CheckoutSummaryProps {
  cart: CartItem[];
  calculateTotal: () => number;
  onBack: () => void;
}

const CheckoutSummary = ({ cart, calculateTotal, onBack }: CheckoutSummaryProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <Table>
        <TableBody>
          {cart.map((item) => {
            const discountedPrice = item.discount 
              ? Math.round(item.price * (1 - item.discount / 100))
              : item.price;
              
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {item.quantity} &times; {discountedPrice.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {(discountedPrice * item.quantity).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={2} className="font-semibold">Total</TableCell>
            <TableCell className="text-right font-semibold">
              {calculateTotal().toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back to Cart
        </Button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
