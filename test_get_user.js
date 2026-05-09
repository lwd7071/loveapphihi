import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssckftnqasjstdukdddj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2tmdG5xYXNqc3RkdWtkZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc0MDksImV4cCI6MjA5Mzg2MzQwOX0.ShnJykSak8H48t4ozj4mFSuLYbd5DjOVvDCbtbZdIa8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('1. Signing in...');
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'luongvietvidong@gmail.com',
    password: 'lvvd7071'
  });
  
  console.log('2. Getting user explicitly (like frontend)...');
  // This is what diaryEntryService.create does
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) console.error('getUser error:', authError);
  else console.log('getUser success! user.id:', user.id);
}

test().catch(console.error);
