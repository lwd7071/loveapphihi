import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssckftnqasjstdukdddj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2tmdG5xYXNqc3RkdWtkZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc0MDksImV4cCI6MjA5Mzg2MzQwOX0.ShnJykSak8H48t4ozj4mFSuLYbd5DjOVvDCbtbZdIa8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('\n1. Testing Auth (Auto Login)...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'luongvietvidong@gmail.com',
    password: 'lvvd7071'
  });
  
  if (authError) {
    console.error('Auth Error:', authError.message);
    return;
  }
  console.log('Auth Success! User ID:', authData.user.id);
  
  console.log('\n2. Testing Insert...');
  const { data, error } = await supabase
    .from('diary_entries')
    .insert([
      {
        title: 'Test direct API',
        content: 'Testing from node script',
        user_id: authData.user.id,
        entry_date: new Date().toISOString().split('T')[0]
      }
    ])
    .select();
    
  if (error) {
    console.error('Insert Error:', error.message, error.details, error.hint);
  } else {
    console.log('Insert Success! Data:', data);
  }
}

test().catch(console.error);
