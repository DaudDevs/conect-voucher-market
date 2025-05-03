
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
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

const ProductCard = ({ 
  id, 
  name, 
  price, 
  description, 
  category, 
  image, 
  duration, 
  isPopular = false,
  discount
}: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
  
  const discountedPrice = discount ? new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price - (price * discount / 100)) : null;

  return (
    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPopular && (
            <Badge className="bg-brand-orange">Popular</Badge>
          )}
          {discount && (
            <Badge className="bg-brand-pink">{discount}% OFF</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-base">{name}</h3>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
          <Badge variant="outline" className="text-xs">{duration}</Badge>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>
        
        <div className="flex items-baseline gap-2">
          {discount ? (
            <>
              <span className="font-bold">{discountedPrice}</span>
              <span className="text-xs text-muted-foreground line-through">{formattedPrice}</span>
            </>
          ) : (
            <span className="font-bold">{formattedPrice}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/product/${id}`}>Details</Link>
        </Button>
        <Button size="sm" className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
