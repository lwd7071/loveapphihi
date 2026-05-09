import { supabase } from './supabase';

// Helper to handle Supabase errors
const handleError = (error) => {
  console.error('Supabase error:', error);
  throw error;
};

// Couple Profile Service
export const coupleProfileService = {
  async list() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleError(error);
    return data || [];
  },

  async get(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  }
};

// Diary Entry Service
export const diaryEntryService = {
  async list(limit = null) {
    let query = supabase
      .from('diary_entries')
      .select('*')
      .order('entry_date', { ascending: false });
    
    if (limit) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  async create(entry) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Vui lòng đăng nhập lại (Lỗi xác thực: Sai API Key hoặc phiên đăng nhập hết hạn).");
    
    const { data, error } = await supabase
      .from('diary_entries')
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('diary_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error);
  }
};

// Love Note Service
export const loveNoteService = {
  async list(limit = null) {
    let query = supabase
      .from('love_notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },

  async create(note) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Vui lòng đăng nhập lại (Lỗi xác thực: Sai API Key hoặc phiên đăng nhập hết hạn).");
    
    const { data, error } = await supabase
      .from('love_notes')
      .insert([{ ...note, user_id: user.id, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('love_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  // Realtime subscription
  subscribe(callback) {
    const channel = supabase
      .channel('love_notes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'love_notes' },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// Memory Service
export const memoryService = {
  async list() {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('memory_date', { ascending: false });
    
    if (error) handleError(error);
    return data || [];
  },

  async create(memory) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Vui lòng đăng nhập lại (Lỗi xác thực: Sai API Key hoặc phiên đăng nhập hết hạn).");
    
    const { data, error } = await supabase
      .from('memories')
      .insert([{ ...memory, user_id: user.id }])
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error);
  }
};

// Bucket List Service
export const bucketListService = {
  async list() {
    const { data, error } = await supabase
      .from('bucket_list')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleError(error);
    return data || [];
  },

  async create(item) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Vui lòng đăng nhập lại (Lỗi xác thực: Sai API Key hoặc phiên đăng nhập hết hạn).");
    
    const { data, error } = await supabase
      .from('bucket_list')
      .insert([{ ...item, user_id: user.id }])
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('bucket_list')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleError(error);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('bucket_list')
      .delete()
      .eq('id', id);
    
    if (error) handleError(error);
  }
};

// Photo Upload Service
export const uploadPhoto = async (file) => {
  const { data: { user } } = await supabase.auth.getUser();
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file);

  if (error) handleError(error);

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  return publicUrl;
};
