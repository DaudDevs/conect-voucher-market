import { useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  FolderIcon, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Home
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const { user, profile, loading, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin area.",
      });
      navigate('/');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not admin, don't render anything (redirection happens in useEffect)
  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Package className="mr-3 h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/categories" 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <FolderIcon className="mr-3 h-5 w-5" />
                Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                Orders
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/customers" 
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Users className="mr-3 h-5 w-5" />
                Customers
              </Link>
            </li>
          </ul>
          <div className="mt-auto px-6 py-4">
            <Link 
              to="/"
              className="flex items-center py-3 text-gray-700 hover:text-primary"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Site
            </Link>
            <Button 
              variant="ghost" 
              className="flex w-full items-center justify-start px-0 py-3 text-gray-700 hover:text-primary"
              onClick={signOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
