
import { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  duration: string;
  isPopular?: boolean;
  discount?: number;
}

const placeholderProducts: Product[] = [
  {
    id: "1",
    name: "Teleconect Home Basic",
    price: 50000,
    description: "Basic internet package for small households with 10Mbps speed",
    category: "Teleconect",
    image: "/placeholder.svg",
    duration: "30 Days",
    isPopular: true
  },
  {
    id: "2",
    name: "Netfusion Unlimited",
    price: 120000,
    description: "Unlimited high-speed internet for streaming and gaming",
    category: "Netfusion",
    image: "/placeholder.svg",
    duration: "30 Days",
    discount: 15
  },
  {
    id: "3",
    name: "Datastream Weekend",
    price: 25000,
    description: "Weekend-only package for casual browsing",
    category: "Datastream",
    image: "/placeholder.svg",
    duration: "2 Days"
  },
  {
    id: "4",
    name: "Webconect Business",
    price: 200000,
    description: "Reliable internet solution for small businesses with priority support",
    category: "Webconect",
    image: "/placeholder.svg",
    duration: "30 Days",
    isPopular: true
  }
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts(placeholderProducts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-2">Featured Vouchers</h2>
        <p className="text-muted-foreground mb-8">Our most popular wifi voucher packages</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
