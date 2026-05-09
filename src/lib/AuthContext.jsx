import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase, ensureAuth } from '@/lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setProfile(data);
    } catch (error) {
      // Profile chưa có - không sao, sẽ tạo trong Settings
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    ensureAuth()
      .then(async (authUser) => {
        if (cancelled || !authUser) return;
        setUser(authUser);
        setIsAuthenticated(true);
        await loadProfile(authUser.id);
      })
      .catch((err) => {
        if (!cancelled) console.error('Auth error:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingAuth(false);
      });

    // Lắng nghe thay đổi auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return;
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          await loadProfile(session.user.id);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  }, []);

  // Giữ lại cho các component cũ không bị lỗi
  const signUp = async () => {};
  const signIn = async () => {};

  return (
    <AuthContext.Provider 
      value={{ user, profile, isAuthenticated, isLoadingAuth, signUp, signIn, logout }}
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
