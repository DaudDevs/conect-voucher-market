
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CartEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-16 text-center">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <p className="text-muted-foreground mb-8">Your cart is empty</p>
      <Button onClick={() => navigate('/')}>Continue Shopping</Button>
    </div>
  );
};

export default CartEmpty;
