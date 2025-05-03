
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container flex flex-col items-center justify-center py-16">
      <h1 className="text-5xl font-bold text-brand-blue mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
