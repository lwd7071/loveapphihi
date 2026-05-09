# 🚀 Quick Start Guide

## Bắt đầu trong 5 phút!

### Bước 1: Install Dependencies
```bash
npm install @supabase/supabase-js
```

### Bước 2: Setup Supabase Project

1. **Tạo project mới tại [supabase.com](https://supabase.com)**
   - Click "New Project"
   - Chọn organization
   - Đặt tên project (vd: "couple-notebook")
   - Chọn region gần nhất
   - Tạo database password (lưu lại!)
   - Click "Create new project"

2. **Lấy API credentials**
   - Vào Settings → API
   - Copy `Project URL`
   - Copy `anon public` key

### Bước 3: Setup Environment Variables

```bash
cp .env.example .env
```

Mở `.env` và điền:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Bước 4: Setup Database

1. Vào Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy toàn bộ nội dung từ file `supabase-setup.sql`
4. Paste vào editor
5. Click "Run" (hoặc Ctrl/Cmd + Enter)
6. Đợi ~10 giây để hoàn thành

### Bước 5: Setup Storage

1. Vào Storage trong Supabase Dashboard
2. Click "Create a new bucket"
3. Bucket name: `photos`
4. Public bucket: ✅ **Check this**
5. Click "Create bucket"

> **Note:** Policies đã được tạo tự động trong SQL script

### Bước 6: Start Development Server

```bash
npm run dev
```

Mở http://localhost:5173

### Bước 7: Tạo tài khoản đầu tiên

1. Click "Chưa có tài khoản? Đăng ký"
2. Điền thông tin:
   - Tên của bạn
   - Chọn Partner 1 hoặc Partner 2
   - Email
   - Password (tối thiểu 6 ký tự)
3. Click "Đăng ký"

> **Note:** Nếu bật email confirmation trong Supabase, bạn cần xác nhận email trước khi đăng nhập

### Bước 8: Setup thông tin couple

1. Sau khi đăng nhập, vào Settings (⚙️)
2. Điền:
   - Tên đôi (vd: "Anh & Em")
   - Tên người 1
   - Tên người 2
   - Ngày bắt đầu yêu
3. Click "Lưu thông tin 💕"

### Bước 9: Bắt đầu sử dụng!

Giờ bạn có thể:
- ✍️ Viết nhật ký
- 💌 Gửi love notes
- 📸 Lưu kỷ niệm
- 🎯 Tạo bucket list
- 🕰️ Xem timeline

---

## 🎉 Xong rồi!

App của bạn đã sẵn sàng! Mời người yêu tạo tài khoản và bắt đầu lưu giữ kỷ niệm nhé! 💕

---

## ⚙️ Optional: Disable Email Confirmation

Nếu bạn muốn đăng ký mà không cần xác nhận email:

1. Vào Supabase Dashboard → Authentication → Settings
2. Tìm "Email Confirmation"
3. Tắt "Enable email confirmations"
4. Click "Save"

---

## 🐛 Troubleshooting

### Lỗi: "Invalid API key"
- Kiểm tra lại `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong `.env`
- Restart dev server: `npm run dev`

### Lỗi: "relation does not exist"
- Chạy lại SQL script trong Supabase SQL Editor
- Kiểm tra tất cả tables đã được tạo trong Table Editor

### Lỗi: "Storage bucket not found"
- Tạo bucket `photos` trong Storage
- Đảm bảo bucket là public

### Lỗi: "Row Level Security policy violation"
- Kiểm tra RLS policies đã được tạo
- Chạy lại phần policies trong SQL script

### Upload ảnh không hoạt động
- Kiểm tra storage bucket `photos` tồn tại
- Kiểm tra bucket là public
- Kiểm tra storage policies

---

## 📚 Tài liệu thêm

- **MIGRATION_GUIDE.md** - Chi tiết về migration
- **CONVERSION_SUMMARY.md** - Tổng quan về những gì đã thay đổi
- **supabase-setup.sql** - Database schema đầy đủ

---

## 💡 Tips

1. **Backup data**: Export data thường xuyên từ Supabase Dashboard
2. **Monitor usage**: Kiểm tra usage trong Supabase Dashboard để tránh vượt free tier
3. **Security**: Không share anon key công khai (đã có trong .gitignore)
4. **Performance**: React Query tự động cache, không cần lo về performance

---

## 🎊 Enjoy!

Chúc bạn và người yêu có những kỷ niệm đẹp! 💕
