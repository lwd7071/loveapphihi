import { createClient } from '@supabase/supabase-js';

// Use proxy URL to bypass adblockers
const SUPABASE_URL = window.location.origin + '/supabase-api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2tmdG5xYXNqc3RkdWtkZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc0MDksImV4cCI6MjA5Mzg2MzQwOX0.ShnJykSak8H48t4ozj4mFSuLYbd5DjOVvDCbtbZdIa8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auto-login credentials
const AUTO_EMAIL = 'luongvietvidong@gmail.com';
const AUTO_PASS = 'lvvd7071';

// Promise đảm bảo đã login xong trước khi dùng
let _authReady = null;

export function ensureAuth() {
  if (_authReady) return _authReady;

  _authReady = (async () => {
    // Kiểm tra session đã có chưa
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;

    // Chưa có -> đăng nhập
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
        await supabase.from('profiles').insert([
          { id: signUpData.user.id, username: 'Couple', role: 'partner1' }
        ]);
        return signUpData.user;
      }
      throw new Error('Không thể đăng nhập');
    }

    return data.user;
  })();

  return _authReady;
}

// Khởi động auto-login ngay khi load file
ensureAuth().catch(console.error);
