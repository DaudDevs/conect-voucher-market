
import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

const placeholderCategories: Category[] = [
  {
    id: "1",
    name: "Teleconect",
    slug: "teleconect",
    icon: "/placeholder.svg",
    description: "High-speed internet for homes and offices",
    color: "bg-blue-50 hover:bg-blue-100"
  },
  {
    id: "2",
    name: "Netfusion",
    slug: "netfusion",
    icon: "/placeholder.svg",
    description: "Seamless connectivity for heavy usage",
    color: "bg-purple-50 hover:bg-purple-100"
  },
  {
    id: "3",
    name: "Datastream",
    slug: "datastream",
    icon: "/placeholder.svg",
    description: "Budget-friendly options for everyday use",
    color: "bg-green-50 hover:bg-green-100"
  },
  {
    id: "4",
    name: "Webconect",
    slug: "webconect",
    icon: "/placeholder.svg",
    description: "Fast and reliable connectivity everywhere",
    color: "bg-orange-50 hover:bg-orange-100"
  },
  {
    id: "5",
    name: "Remasnetwork",
    slug: "remasnetwork",
    icon: "/placeholder.svg",
    description: "Premium quality network solutions",
    color: "bg-pink-50 hover:bg-pink-100"
  },
  {
    id: "6",
    name: "Starlink",
    slug: "starlink",
    icon: "/placeholder.svg",
    description: "Satellite internet for remote locations",
    color: "bg-indigo-50 hover:bg-indigo-100"
  }
];

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setCategories(placeholderCategories);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Browse by Provider</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))
          ) : (
            categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
