
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col space-y-3">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">ConnectVoucher</Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your one-stop shop for WiFi vouchers from various providers across Indonesia.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/teleconect" className="text-muted-foreground hover:text-foreground transition-colors">Teleconect</Link></li>
              <li><Link to="/category/netfusion" className="text-muted-foreground hover:text-foreground transition-colors">Netfusion</Link></li>
              <li><Link to="/category/datastream" className="text-muted-foreground hover:text-foreground transition-colors">Datastream</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="container mt-8 border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ConnectVoucher. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
