import { createClient } from '@supabase/supabase-js';

// Use proxy URL to bypass adblockers
const SUPABASE_URL = window.location.origin + '/supabase-api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2tmdG5xYXNqc3RkdWtkZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc0MDksImV4cCI6MjA5Mzg2MzQwOX0.ShnJykSak8H48t4ozj4mFSuLYbd5DjOVvDCbtbZdIa8';

// Custom fetch interceptor to handle single-session limits
const customFetch = async (url, options) => {
  let response = await fetch(url, options);
  if (response.status === 401 || response.status === 403) {
    console.warn('Session expired or revoked. Auto-refreshing auth...');
    await ensureAuth(true); // Force re-login
    
    // Inject the new token into headers and retry
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      if (options.headers instanceof Headers) {
        options.headers.set('Authorization', `Bearer ${token}`);
      } else if (typeof options.headers === 'object') {
        options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
      }
    }
    response = await fetch(url, options);
  }
  return response;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: customFetch }
});

// Auto-login credentials
const AUTO_EMAIL = 'luongvietvidong@gmail.com';
const AUTO_PASS = 'lvvd7071';

// Promise đảm bảo đã login xong trước khi dùng
let _authReady = null;

export function ensureAuth(forceRefresh = false) {
  if (_authReady && !forceRefresh) return _authReady;

  _authReady = (async () => {
    if (!forceRefresh) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) return session.user;
    }

    // Chưa có hoặc bị ép -> đăng nhập lại
    const { data, error } = await supabase.auth.signInWithPassword({
      email: AUTO_EMAIL,
      password: AUTO_PASS,
    });

    if (error) {
      // Tài khoản chưa có -> tạo mới
      const { data: signUpData } = await supabase.auth.signUp({
        email: AUTO_EMAIL,
        password: AUTO_PASS,
      });
      if (signUpData?.user) {
        // Upsert profile
        await supabase.from('profiles').upsert({ id: signUpData.user.id, username: 'Couple', role: 'partner1' });
        return signUpData.user;
      }
      throw new Error('Không thể đăng nhập');
    }

    return data.user;
  })().catch(err => {
    _authReady = null;
    throw err;
  });

  return _authReady;
}

// Khởi động auto-login ngay khi load file
ensureAuth().catch(console.error);
