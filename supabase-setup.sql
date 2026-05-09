-- =====================================================
-- Couple Notebook App - Supabase Database Setup
-- =====================================================

-- 1. PROFILES TABLE
-- =====================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  role text check (role in ('partner1', 'partner2')),
  couple_name text,
  partner1_name text,
  partner2_name text,
  start_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. DIARY ENTRIES TABLE
-- =====================================================
create table if not exists diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  mood text,
  author_name text,
  entry_date date not null,
  photo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table diary_entries enable row level security;

-- Policies
create policy "Users can view all diary entries"
  on diary_entries for select
  using (true);

create policy "Users can create diary entries"
  on diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on diary_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on diary_entries for delete
  using (auth.uid() = user_id);

-- 3. LOVE NOTES TABLE
-- =====================================================
create table if not exists love_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  message text not null,
  from_name text not null,
  to_name text not null,
  sticker text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table love_notes enable row level security;

-- Policies
create policy "Users can view all love notes"
  on love_notes for select
  using (true);

create policy "Users can create love notes"
  on love_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update love notes"
  on love_notes for update
  using (true);

-- Enable realtime for love notes
alter publication supabase_realtime add table love_notes;

-- 4. MEMORIES TABLE
-- =====================================================
create table if not exists memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  memory_date date not null,
  category text check (category in ('first_time', 'travel', 'anniversary', 'daily', 'special')),
  photos text[],
  is_favorite boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table memories enable row level security;

-- Policies
create policy "Users can view all memories"
  on memories for select
  using (true);

create policy "Users can create memories"
  on memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update memories"
  on memories for update
  using (true);

create policy "Users can delete memories"
  on memories for delete
  using (true);

-- 5. BUCKET LIST TABLE
-- =====================================================
create table if not exists bucket_list (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('travel', 'food', 'activity', 'milestone', 'other')),
  emoji text,
  is_done boolean default false,
  done_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table bucket_list enable row level security;

-- Policies
create policy "Users can view all bucket items"
  on bucket_list for select
  using (true);

create policy "Users can create bucket items"
  on bucket_list for insert
  with check (auth.uid() = user_id);

create policy "Users can update bucket items"
  on bucket_list for update
  using (true);

create policy "Users can delete bucket items"
  on bucket_list for delete
  using (true);

-- 6. STORAGE BUCKET FOR PHOTOS
-- =====================================================
-- Run this in Supabase Dashboard > Storage
-- Or use the Supabase Dashboard UI to create a bucket named 'photos'

-- Create bucket (if using SQL)
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'photos' 
    and auth.role() = 'authenticated'
  );

create policy "Public can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Users can update their own photos"
  on storage.objects for update
  using (
    bucket_id = 'photos' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own photos"
  on storage.objects for delete
  using (
    bucket_id = 'photos' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_diary_entries_updated_at
  before update on diary_entries
  for each row
  execute function update_updated_at_column();

create trigger update_memories_updated_at
  before update on memories
  for each row
  execute function update_updated_at_column();

create trigger update_bucket_list_updated_at
  before update on bucket_list
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Copy your Supabase URL and anon key to .env
-- 2. Run: npm install @supabase/supabase-js
-- 3. Run: npm run dev
-- 4. Create an account and start using the app!
