
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription?: string;
  category: string;
  image: string;
  duration: string;
  isPopular?: boolean;
  discount?: number;
  features?: string[];
  howToUse?: string[];
}

// This would be loaded from Supabase in a real application
const productDatabase: Record<string, Product> = {
  "tc1": {
    id: "tc1",
    name: "Teleconect Basic",
    price: 50000,
    description: "Basic internet package with 10Mbps speed",
    longDescription: "Teleconect Basic provides reliable internet access for light users who primarily browse the web, check emails, and use social media. With speeds up to 10Mbps, this package is perfect for single users or small households with basic internet needs.",
    category: "Teleconect",
    image: "/placeholder.svg",
    duration: "30 Days",
    features: [
      "10Mbps download speed",
      "5Mbps upload speed",
      "Valid for 30 days from activation",
      "Connect up to 2 devices simultaneously"
    ],
    howToUse: [
      "Purchase and receive your voucher code via email",
      "Connect to any Teleconect WiFi network",
      "Enter your voucher code when prompted",
      "Enjoy your internet access for the duration of the voucher"
    ]
  },
  "tc2": {
    id: "tc2",
    name: "Teleconect Premium",
    price: 100000,
    description: "Premium package with 50Mbps speed",
    longDescription: "Teleconect Premium delivers high-speed internet access ideal for streaming HD content, online gaming, and working from home. With speeds up to 50Mbps, this package ensures smooth online experiences even with multiple devices connected.",
    category: "Teleconect",
    image: "/placeholder.svg",
    duration: "30 Days",
    isPopular: true,
    features: [
      "50Mbps download speed",
      "20Mbps upload speed",
      "Valid for 30 days from activation",
      "Connect up to 5 devices simultaneously",
      "Priority customer support"
    ],
    howToUse: [
      "Purchase and receive your voucher code via email",
      "Connect to any Teleconect WiFi network",
      "Enter your voucher code when prompted",
      "Enjoy your internet access for the duration of the voucher"
    ]
  },
  // Add more products as needed
};

const ProductDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching product data
    const timer = setTimeout(() => {
      const foundProduct = productDatabase[id];
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      toast.success(`Added ${quantity} ${product.name} voucher(s) to cart`);
      // In a real app, this would add to a cart state or context
    }
  };

  const handleBuyNow = () => {
    if (product) {
      toast.success(`Proceeding to checkout for ${product.name}`);
      // In a real app, this would redirect to checkout with this product
      navigate("/checkout");
    }
  };

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          
          <div className="w-full lg:w-3/5 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-x-4 pt-4">
              <Skeleton className="h-10 w-32 inline-block" />
              <Skeleton className="h-10 w-32 inline-block" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : null;

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/5">
          <Card className="mb-4 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </Card>
        </div>
        
        <div className="w-full lg:w-3/5">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{product.category}</Badge>
            {product.isPopular && <Badge className="bg-brand-orange">Popular</Badge>}
            {product.discount && <Badge className="bg-brand-pink">{product.discount}% OFF</Badge>}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-baseline gap-2 mb-4">
            {discountedPrice ? (
              <>
                <span className="text-2xl font-bold">{formattedPrice(discountedPrice)}</span>
                <span className="text-muted-foreground line-through">{formattedPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">{formattedPrice(product.price)}</span>
            )}
            <Badge variant="outline" className="ml-2">{product.duration}</Badge>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {product.longDescription || product.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button 
              className="flex-1"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
          
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-4">
              {product.features ? (
                <ul className="space-y-2 list-disc pl-5">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No feature information available.</p>
              )}
            </TabsContent>
            <TabsContent value="how-to-use" className="pt-4">
              {product.howToUse ? (
                <ol className="space-y-2 list-decimal pl-5">
                  {product.howToUse.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No usage information available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
