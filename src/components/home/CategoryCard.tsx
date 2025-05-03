
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

const CategoryCard = ({ name, slug, icon, description, color }: CategoryCardProps) => {
  return (
    <Link to={`/category/${slug}`}>
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
        <CardContent className={`p-6 ${color} flex flex-col items-center text-center`}>
          <div className="mb-4 rounded-full bg-white/90 p-3">
            <img src={icon} alt={name} className="h-10 w-10" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
