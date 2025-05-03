
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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

const demoProducts: Record<string, Product[]> = {
  teleconect: [
    {
      id: "tc1",
      name: "Teleconect Basic",
      price: 50000,
      description: "Basic internet package with 10Mbps speed",
      category: "Teleconect",
      image: "/placeholder.svg",
      duration: "30 Days"
    },
    {
      id: "tc2",
      name: "Teleconect Premium",
      price: 100000,
      description: "Premium package with 50Mbps speed",
      category: "Teleconect",
      image: "/placeholder.svg",
      duration: "30 Days",
      isPopular: true
    },
    {
      id: "tc3",
      name: "Teleconect Unlimited",
      price: 150000,
      description: "Unlimited data with 100Mbps speed",
      category: "Teleconect",
      image: "/placeholder.svg",
      duration: "30 Days",
      discount: 10
    },
    {
      id: "tc4",
      name: "Teleconect Daily",
      price: 10000,
      description: "24-hour access with 20Mbps speed",
      category: "Teleconect",
      image: "/placeholder.svg",
      duration: "1 Day"
    }
  ],
  netfusion: [
    {
      id: "nf1",
      name: "Netfusion Standard",
      price: 75000,
      description: "Standard package for everyday use",
      category: "Netfusion",
      image: "/placeholder.svg",
      duration: "30 Days"
    },
    {
      id: "nf2",
      name: "Netfusion Gaming",
      price: 125000,
      description: "Low latency package optimized for gaming",
      category: "Netfusion",
      image: "/placeholder.svg",
      duration: "30 Days",
      isPopular: true
    },
    {
      id: "nf3",
      name: "Netfusion Family",
      price: 200000,
      description: "High-speed package for multiple devices",
      category: "Netfusion",
      image: "/placeholder.svg",
      duration: "30 Days",
      discount: 15
    }
  ],
  datastream: [
    {
      id: "ds1",
      name: "Datastream Lite",
      price: 40000,
      description: "Light usage package for browsing and emails",
      category: "Datastream",
      image: "/placeholder.svg", 
      duration: "30 Days"
    },
    {
      id: "ds2",
      name: "Datastream Weekend",
      price: 35000,
      description: "Weekend-only high-speed package",
      category: "Datastream",
      image: "/placeholder.svg",
      duration: "2 Days"
    }
  ],
  webconect: [
    {
      id: "wc1",
      name: "Webconect Office",
      price: 250000,
      description: "Business-grade internet with static IP",
      category: "Webconect",
      image: "/placeholder.svg",
      duration: "30 Days",
      isPopular: true
    },
    {
      id: "wc2",
      name: "Webconect Startup",
      price: 175000,
      description: "Reliable connection for small teams",
      category: "Webconect",
      image: "/placeholder.svg",
      duration: "30 Days"
    }
  ],
  remasnetwork: [
    {
      id: "rn1",
      name: "Remasnetwork Basic",
      price: 60000,
      description: "Budget-friendly package for basic needs",
      category: "Remasnetwork", 
      image: "/placeholder.svg",
      duration: "30 Days"
    },
    {
      id: "rn2",
      name: "Remasnetwork Pro",
      price: 120000,
      description: "Professional package with priority support",
      category: "Remasnetwork",
      image: "/placeholder.svg",
      duration: "30 Days",
      discount: 5
    }
  ],
  starlink: [
    {
      id: "sl1",
      name: "Starlink Rural",
      price: 500000,
      description: "Satellite internet for remote areas",
      category: "Starlink",
      image: "/placeholder.svg",
      duration: "30 Days",
      isPopular: true
    },
    {
      id: "sl2",
      name: "Starlink Portable",
      price: 450000,
      description: "Portable satellite internet for travelers",
      category: "Starlink",
      image: "/placeholder.svg",
      duration: "30 Days",
      discount: 8
    }
  ],
  popular: [] // will be filled with popular products
};

// Add popular products
demoProducts.popular = [
  ...Object.values(demoProducts).flat().filter(p => p.isPopular)
];

const categoryInfo: Record<string, { name: string, description: string, bgClass: string }> = {
  teleconect: {
    name: "Teleconect",
    description: "High-speed internet vouchers for homes and offices",
    bgClass: "bg-blue-50"
  },
  netfusion: {
    name: "Netfusion",
    description: "Seamless connectivity for heavy usage and streaming",
    bgClass: "bg-purple-50"
  },
  datastream: {
    name: "Datastream",
    description: "Budget-friendly options for everyday internet use",
    bgClass: "bg-green-50"
  },
  webconect: {
    name: "Webconect",
    description: "Business-grade connectivity solutions",
    bgClass: "bg-orange-50"
  },
  remasnetwork: {
    name: "Remasnetwork",
    description: "Premium quality network solutions for professionals",
    bgClass: "bg-pink-50"
  },
  starlink: {
    name: "Starlink",
    description: "Satellite internet for remote locations and travelers",
    bgClass: "bg-indigo-50"
  },
  popular: {
    name: "Popular Vouchers",
    description: "Our most in-demand WiFi voucher packages",
    bgClass: "bg-gray-50"
  }
};

const CategoryPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts(demoProducts[slug] || []);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoryData = categoryInfo[slug] || {
    name: "Category Not Found",
    description: "Please check the URL and try again",
    bgClass: "bg-gray-50"
  };

  return (
    <>
      <div className={`py-10 ${categoryData.bgClass}`}>
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{categoryData.name}</h1>
          <p className="text-muted-foreground">{categoryData.description}</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vouchers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No vouchers found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any vouchers matching your search criteria.
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
