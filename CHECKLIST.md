# ✅ Conversion Checklist

## Setup

- [ ] Install Supabase: `npm install @supabase/supabase-js`
- [ ] Create Supabase project
- [ ] Copy `.env.example` to `.env`
- [ ] Add Supabase URL and anon key to `.env`
- [ ] Run `supabase-setup.sql` in Supabase SQL Editor
- [ ] Create `photos` storage bucket (public)
- [ ] Start dev server: `npm run dev`

## Testing

### Authentication
- [ ] Can register new account
- [ ] Can login with email/password
- [ ] Can logout
- [ ] Protected routes redirect to login
- [ ] User info shows in Settings

### Dashboard
- [ ] Days counter shows correctly
- [ ] Quick actions navigate to correct pages
- [ ] Recent diary entries display
- [ ] Latest love note displays
- [ ] Anniversary card shows next milestone

### Diary
- [ ] Can create new diary entry
- [ ] Can select mood
- [ ] Can upload photo
- [ ] Entries display in list
- [ ] Entries sorted by date (newest first)

### Love Notes
- [ ] Can send love note
- [ ] Can select sticker
- [ ] Notes display in list
- [ ] Unread notes highlighted
- [ ] Can mark as read
- [ ] **Realtime**: New notes appear without refresh

### Memories
- [ ] Can create new memory
- [ ] Can select category
- [ ] Can upload multiple photos
- [ ] Can toggle favorite
- [ ] Memories display in grid
- [ ] Can view memory detail modal
- [ ] Photos display in modal

### Bucket List
- [ ] Can create new bucket item
- [ ] Can select category
- [ ] Can toggle done/undone
- [ ] Progress bar updates
- [ ] Done items move to bottom
- [ ] Done date displays

### Timeline
- [ ] Memories display in chronological order
- [ ] Timeline line displays
- [ ] Category colors show correctly
- [ ] Favorite star displays
- [ ] Photos display inline

### Settings
- [ ] Can update couple name
- [ ] Can update partner names
- [ ] Can update start date
- [ ] Changes save successfully
- [ ] User email displays
- [ ] Logout button works

## Data Persistence

- [ ] Diary entries persist after refresh
- [ ] Love notes persist after refresh
- [ ] Memories persist after refresh
- [ ] Bucket items persist after refresh
- [ ] Profile settings persist after refresh
- [ ] Photos persist after refresh

## Photo Upload

- [ ] Can upload photo in Diary
- [ ] Can upload multiple photos in Memories
- [ ] Photos display correctly
- [ ] Photos accessible via URL
- [ ] Photos organized by user ID

## Realtime

- [ ] Love notes update in realtime
- [ ] Multiple browser tabs sync
- [ ] No polling/manual refresh needed

## Security

- [ ] Cannot access app without login
- [ ] Cannot view other users' private data
- [ ] Can view shared couple data
- [ ] RLS policies working
- [ ] Storage policies working

## UI/UX

- [ ] All animations work
- [ ] All styles preserved
- [ ] Responsive on mobile
- [ ] Loading states show
- [ ] Error messages display
- [ ] Success toasts show

## Performance

- [ ] Pages load quickly
- [ ] No console errors
- [ ] No console warnings
- [ ] React Query caching works
- [ ] Images load efficiently

## Code Quality

- [ ] No Base44 imports remain
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All components render
- [ ] All routes work

## Documentation

- [ ] README updated
- [ ] QUICK_START.md created
- [ ] MIGRATION_GUIDE.md created
- [ ] CONVERSION_SUMMARY.md created
- [ ] supabase-setup.sql created
- [ ] .env.example created

## Deployment (Optional)

- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Deploy to Vercel/Netlify
- [ ] Environment variables set in hosting
- [ ] Production URL works

---

## 🎉 All Done!

When all checkboxes are checked, your conversion is complete! 💕

---

## 📝 Notes

Use this space to track issues or things to remember:

```
[Your notes here]
```
