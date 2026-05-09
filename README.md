# 💕 Couple Notebook - Our Love Story

A beautiful, feature-rich couple notebook app to track your love journey together. Write diaries, send love notes, save memories, and create your bucket list!

![React](https://img.shields.io/badge/React-18-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 📔 **Diary** - Write daily entries with mood tracking and photos
- 💌 **Love Notes** - Send sweet messages with realtime updates
- 📸 **Memories** - Save special moments with multiple photos
- 🎯 **Bucket List** - Track things you want to do together
- 🕰️ **Timeline** - View your journey chronologically
- ⚙️ **Settings** - Manage couple profile and preferences
- 🔐 **Authentication** - Secure login with Supabase Auth
- ⚡ **Realtime** - Love notes update instantly
- 📱 **Responsive** - Beautiful UI on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier works!)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd couple-notebook
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase**

Follow the detailed guide in [QUICK_START.md](./QUICK_START.md)

Quick version:
- Create Supabase project at [supabase.com](https://supabase.com)
- Copy `.env.example` to `.env`
- Add your Supabase URL and anon key
- Run `supabase-setup.sql` in Supabase SQL Editor
- Create `photos` storage bucket

4. **Start development server**
```bash
npm run dev
```

5. **Open app**
```
http://localhost:5173
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Detailed migration from Base44
- **[CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md)** - What changed
- **[CHECKLIST.md](./CHECKLIST.md)** - Testing checklist
- **[supabase-setup.sql](./supabase-setup.sql)** - Database schema

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **React Query** - Data fetching & caching
- **React Router** - Routing
- **date-fns** - Date utilities
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Realtime subscriptions
  - Row Level Security

## 📁 Project Structure

```
couple-notebook/
├── src/
│   ├── api/
│   │   └── base44Client.js          # Legacy (can be removed)
│   ├── components/
│   │   ├── dashboard/               # Dashboard components
│   │   ├── memories/                # Memory components
│   │   ├── ui/                      # shadcn/ui components
│   │   └── Layout.jsx               # Main layout
│   ├── lib/
│   │   ├── supabase.js              # Supabase client
│   │   ├── supabase-service.js      # Service layer
│   │   ├── AuthContext.jsx          # Auth context
│   │   ├── query-client.js          # React Query config
│   │   └── utils.js                 # Utilities
│   ├── pages/
│   │   ├── Dashboard.jsx            # Home page
│   │   ├── Diary.jsx                # Diary page
│   │   ├── LoveNotes.jsx            # Love notes page
│   │   ├── Memories.jsx             # Memories page
│   │   ├── BucketList.jsx           # Bucket list page
│   │   ├── Timeline.jsx             # Timeline page
│   │   ├── Settings.jsx             # Settings page
│   │   └── Login.jsx                # Login/Signup page
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── .env.example                     # Environment variables template
├── supabase-setup.sql               # Database setup script
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── README.md                        # This file
```

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles with couple information
- **diary_entries** - Daily diary entries
- **love_notes** - Messages between partners
- **memories** - Special moments with photos
- **bucket_list** - Things to do together

### Storage
- **photos** - Uploaded photos bucket

See [supabase-setup.sql](./supabase-setup.sql) for complete schema.

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can view all couple data
- Users can only create/update their own data
- Photos organized by user ID
- JWT authentication
- Secure password hashing

## 🎨 Features in Detail

### Dashboard
- Days counter showing time together
- Quick action buttons
- Recent diary entries
- Latest love note
- Next anniversary countdown

### Diary
- Write entries with title and content
- Select mood (happy, love, excited, grateful, miss, sad)
- Upload photo
- View all entries sorted by date

### Love Notes
- Send messages with custom stickers
- Realtime updates (no refresh needed!)
- Mark as read/unread
- Beautiful gradient design

### Memories
- Save special moments
- Upload multiple photos
- Categorize (first time, travel, anniversary, daily, special)
- Mark as favorite
- View in detail modal

### Bucket List
- Create items with emoji
- Categorize (travel, food, activity, milestone, other)
- Mark as done
- Progress bar
- Track completion date

### Timeline
- View all memories chronologically
- Visual timeline with dots
- Category colors
- Inline photos

### Settings
- Update couple name
- Update partner names
- Set start date
- View user info
- Logout

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

**Don't forget to set environment variables in your hosting platform!**

## 🧪 Testing

Use [CHECKLIST.md](./CHECKLIST.md) to test all features:

```bash
# Run dev server
npm run dev

# Open checklist
cat CHECKLIST.md
```

## 🐛 Troubleshooting

See [QUICK_START.md](./QUICK_START.md#-troubleshooting) for common issues and solutions.

## 📝 Migration from Base44

This app was converted from Base44 to Supabase. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own couple notebook!

## 💖 Credits

Built with love using:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 🎉 Enjoy!

We hope you and your partner enjoy using this app to document your love story! 💕

---

**Questions or issues?** Open an issue on GitHub or check the documentation files.

**Want to add features?** Fork the repo and submit a PR!

**Love the app?** Give it a ⭐ on GitHub!
