
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/components/layout/Layout";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "@/components/checkout/PaymentForm";
import { useMutation } from "@tanstack/react-query";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
        setCart([]);
      }
    }
  }, []);

  const updateCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const newCart = cart.map((item) => 
      item.id === productId ? { ...item, quantity } : item
    );
    
    updateCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    updateCart(newCart);
    
    toast.success("Item removed from cart");
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.discount 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  // Fixed mutation to avoid profiles reference causing infinite recursion
  const createOrderMutation = useMutation({
    mutationFn: async ({ paymentId }: { paymentId: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      try {
        // Create order first without any reference to profiles
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total: calculateTotal(),
            payment_id: paymentId,
            status: 'processing'
          })
          .select('id')
          .single();
        
        if (orderError) throw orderError;
        
        // Create order items as a separate operation
        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.discount 
            ? Math.round(item.price * (1 - item.discount / 100))
            : item.price
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        return order;
      } catch (error) {
        console.error("Error creating order:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Clear cart
      updateCart([]);
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Redirect to home
      navigate('/');
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  });

  const handlePaymentSuccess = (paymentId: string) => {
    createOrderMutation.mutate({ paymentId });
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty</p>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {isCheckingOut ? (
        <div className="grid md:grid-cols-2 gap-8">
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
                onClick={() => setIsCheckingOut(false)}
              >
                Back to Cart
              </Button>
            </div>
          </div>
          
          <div>
            <PaymentForm 
              items={cart} 
              total={calculateTotal()}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      ) : (
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
              {cart.map((item) => {
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
              })}
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
              onClick={() => {
                if (!user) {
                  toast("Please log in", {
                    description: "You need to be logged in to checkout."
                  });
                  navigate('/login');
                  return;
                }
                setIsCheckingOut(true);
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
