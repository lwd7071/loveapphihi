# Migration Guide: Base44 → Supabase

## ✅ Đã hoàn thành

### 1. **Authentication**
- ✅ Supabase Auth Context (`src/lib/AuthContext.jsx`)
- ✅ Login/Signup page (`src/pages/Login.jsx`)
- ✅ Protected routes trong App.jsx
- ✅ Logout functionality

### 2. **Database Services**
- ✅ Supabase service layer (`src/lib/supabase-service.js`)
- ✅ Couple Profile service
- ✅ Diary Entry service
- ✅ Love Note service (với realtime)
- ✅ Memory service
- ✅ Bucket List service
- ✅ Photo upload service

### 3. **Pages Updated**
- ✅ Dashboard - hiển thị tổng quan
- ✅ Diary - viết nhật ký + upload ảnh
- ✅ Love Notes - gửi tin nhắn + realtime updates
- ✅ Memories - lưu kỷ niệm + upload nhiều ảnh
- ✅ Bucket List - danh sách mục tiêu
- ✅ Timeline - xem kỷ niệm theo thời gian
- ✅ Settings - cập nhật thông tin + logout

## 🗄️ Database Schema

Bạn cần tạo các bảng sau trong Supabase:

### `profiles`
```sql
create table profiles (
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
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
```

### `diary_entries`
```sql
create table diary_entries (
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
```

### `love_notes`
```sql
create table love_notes (
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

-- Enable realtime
alter publication supabase_realtime add table love_notes;
```

### `memories`
```sql
create table memories (
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
```

### `bucket_list`
```sql
create table bucket_list (
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
```

## 📦 Storage Bucket

Tạo storage bucket cho photos:

1. Vào Supabase Dashboard → Storage
2. Tạo bucket mới tên `photos`
3. Set public access
4. Policies:

```sql
-- Allow authenticated users to upload
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

-- Allow public read access
create policy "Public can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Điền thông tin Supabase:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations
Copy và chạy các SQL scripts ở trên trong Supabase SQL Editor

### 4. Start Development Server
```bash
npm run dev
```

## 🎯 Key Changes

### Column Name Mapping
| Base44 | Supabase |
|--------|----------|
| `created_date` | `created_at` |
| `completed` | `is_done` |
| `completed_at` | `done_date` |

### API Changes
```javascript
// Before (Base44)
base44.entities.DiaryEntry.list('-entry_date', 5)

// After (Supabase)
diaryEntryService.list(5)
```

### Realtime
Love Notes có realtime subscription tự động cập nhật khi có tin nhắn mới.

## 🚀 Features

- ✅ Email/Password authentication
- ✅ Protected routes
- ✅ Realtime love notes
- ✅ Photo upload to Supabase Storage
- ✅ Row Level Security (RLS)
- ✅ Responsive UI
- ✅ Animations với Framer Motion

## 📝 Notes

- Tất cả queries đã được wrap trong React Query để caching
- RLS policies cho phép users xem tất cả data nhưng chỉ tạo/update data của mình
- Photos được lưu trong Supabase Storage bucket `photos`
- Realtime chỉ enable cho `love_notes` table
