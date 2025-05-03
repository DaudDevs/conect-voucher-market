
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  duration: string;
  discount?: number;
}

// Demo cart data - would be stored in context or state management in a real app
const demoCartItems: CartItem[] = [
  {
    id: "cart1",
    productId: "tc2",
    name: "Teleconect Premium",
    price: 100000,
    image: "/placeholder.svg",
    quantity: 1,
    category: "Teleconect",
    duration: "30 Days"
  },
  {
    id: "cart2",
    productId: "nf3",
    name: "Netfusion Family",
    price: 200000,
    image: "/placeholder.svg",
    quantity: 2,
    category: "Netfusion",
    duration: "30 Days",
    discount: 15
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    // Simulate loading cart data
    const timer = setTimeout(() => {
      setCartItems(demoCartItems);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    // Simulate promo code check
    if (promoCode.toLowerCase() === "discount10") {
      toast.success("Promo code applied: 10% discount");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout page
    // or open a payment gateway modal
    toast.success("Proceeding to checkout");
    navigate("/checkout");
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.discount ? 
      item.price - (item.price * item.discount / 100) : 
      item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2" />
        Your Shopping Cart
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any vouchers to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Browse Vouchers</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice = item.discount ? 
                  item.price - (item.price * item.discount / 100) : 
                  item.price;
                const totalPrice = itemPrice * item.quantity;
                
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex">
                      <div className="w-24 h-24 rounded overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.category} | {item.duration}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            {item.discount ? (
                              <div>
                                <span className="font-medium">{formattedPrice(totalPrice)}</span>
                                <div className="text-xs text-muted-foreground">
                                  <span className="line-through">{formattedPrice(item.price)}</span>
                                  <span className="text-brand-pink ml-1">-{item.discount}%</span>
                                </div>
                              </div>
                            ) : (
                              <span className="font-medium">{formattedPrice(totalPrice)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formattedPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span>{formattedPrice(2000)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formattedPrice(subtotal + 2000)}</span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={applyPromoCode} variant="outline">Apply</Button>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
