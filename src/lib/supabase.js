import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase environment variables!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Kiểm tra kết nối và in ra log
supabase.auth.getSession().then(({ error }) => {
  if (!error) {
    console.log('✅ Kết nối Supabase thành công!');
  } else {
    console.error('❌ Lỗi kết nối Supabase:', error.message);
  }
});
