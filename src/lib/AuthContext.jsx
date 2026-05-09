import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Hardcoded credentials for transparent auto-login
  const AUTO_EMAIL = 'luongvietvidong@gmail.com';
  const AUTO_PASS = 'lvvd7071';

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check if already logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          loadProfile(session.user.id);
        } else {
          // 2. If not logged in, silently login using provided credentials
          const { data, error } = await supabase.auth.signInWithPassword({
            email: AUTO_EMAIL,
            password: AUTO_PASS,
          });
          
          if (error) {
            console.error("Auto-login failed:", error);
            // If it fails (e.g. account doesn't exist), try to sign up silently
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: AUTO_EMAIL,
              password: AUTO_PASS,
            });
            if (!signUpError && signUpData?.user) {
               // Create default profile
               await supabase.from('profiles').insert([
                 { id: signUpData.user.id, username: 'Couple', role: 'partner1' }
               ]);
               setUser(signUpData.user);
               setIsAuthenticated(true);
            }
          } else if (data?.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            loadProfile(data.user.id);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await loadProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) setProfile(data);
    } catch (error) {
      // Profile not found is OK
    }
  };

  // Dummy methods to prevent breaking existing components that might still call them
  const signUp = async () => {};
  const signIn = async () => {};
  const logout = async () => {};

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        profile,
        isAuthenticated,
        isLoadingAuth,
        signUp,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
