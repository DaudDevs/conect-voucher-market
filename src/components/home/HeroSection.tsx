
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative py-12 md:py-24">
      <div className="container flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Get connected <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">anywhere</span> with our WiFi vouchers
          </h1>
          <p className="text-xl text-muted-foreground">
            Buy WiFi vouchers from top providers like Teleconect, Netfusion, Datastream, and more at the best prices
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link to="/products">Browse All Vouchers</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/category/popular">View Popular Options</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-purple/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-blue/20 rounded-full blur-xl"></div>
          <img 
            src="/placeholder.svg" 
            alt="WiFi Vouchers" 
            className="w-full max-w-md mx-auto rounded-lg shadow-lg relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
