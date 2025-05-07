
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/components/layout/Layout";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PaymentForm from "@/components/checkout/PaymentForm";
import CartEmpty from "@/components/cart/CartEmpty";
import CartTable from "@/components/cart/CartTable";
import CheckoutSummary from "@/components/cart/CheckoutSummary";
import { useCartManagement } from "@/components/cart/useCartManagement";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, updateCart, updateQuantity, removeItem, calculateTotal } = useCartManagement();

  const createOrderMutation = useMutation({
    mutationFn: async ({ paymentId }: { paymentId: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      try {
        console.log("Creating order with payment ID:", paymentId);
        
        // Create order directly with minimal fields to avoid RLS recursion
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total: calculateTotal(),
            payment_id: paymentId,
            status: 'processing'
          })
          .select('id');
        
        if (orderError) {
          console.error("Order creation error:", orderError);
          throw orderError;
        }
        
        if (!order || order.length === 0) {
          throw new Error("Failed to retrieve order ID after creation");
        }
        
        const orderId = order[0].id;
        
        // Create order items
        const orderItems = cart.map(item => ({
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
          price: item.discount 
            ? Math.round(item.price * (1 - item.discount / 100))
            : item.price
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.error("Order items creation error:", itemsError);
          throw itemsError;
        }
        
        return { id: orderId };
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

  const handleCheckout = () => {
    if (!user) {
      toast("Please log in", {
        description: "You need to be logged in to checkout."
      });
      navigate('/login');
      return;
    }
    setIsCheckingOut(true);
  };

  // If cart is empty
  if (cart.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {isCheckingOut ? (
        <div className="grid md:grid-cols-2 gap-8">
          <CheckoutSummary 
            cart={cart}
            calculateTotal={calculateTotal}
            onBack={() => setIsCheckingOut(false)}
          />
          
          <div>
            <PaymentForm 
              items={cart} 
              total={calculateTotal()}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      ) : (
        <CartTable 
          cart={cart}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          calculateTotal={calculateTotal}
          onCheckout={handleCheckout}
          isAuthenticated={!!user}
        />
      )}
    </div>
  );
};

export default Cart;
