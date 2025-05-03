
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createContext } from "react";

// Create context for user authentication
export const AuthContext = createContext<{
  user: any;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

const Layout = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session and subscribe to auth changes
    const fetchUser = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        setProfile(profileData);
      }
      
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            
            // Fetch profile data on auth change
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            setProfile(profileData);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };

    fetchUser();
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
};

export default Layout;
