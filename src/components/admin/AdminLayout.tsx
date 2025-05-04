
import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  LogOut,
  Database
} from 'lucide-react';

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "CRUD Manager",
    href: "/admin/crud",
    icon: Database,
  }
];

const AdminLayout = () => {
  const navigate = useNavigate();

  // Check if user is logged in and has admin role
  const { data: user, isLoading } = useQuery({
    queryKey: ['admin-auth-user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Check if user has admin role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (error || profile?.role !== 'admin') {
        throw new Error('Not authorized');
      }
      
      return {
        ...session.user,
        role: profile.role
      };
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Redirect non-admin users to login
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold">Admin Panel</span>
          </Link>
        </div>
        <Separator />
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/admin"}
              className={({ isActive }) => 
                cn("flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.title}
            </NavLink>
          ))}
        </nav>
        <Separator className="my-2" />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
