import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Upload } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { diaryEntryService, uploadPhoto } from '@/lib/supabase-service';
import { useAuth } from '@/lib/AuthContext';

const moodOptions = [
  { value: 'happy', emoji: '😄', label: 'Vui' },
  { value: 'love', emoji: '🥰', label: 'Yêu' },
  { value: 'excited', emoji: '🤩', label: 'Phấn khích' },
  { value: 'grateful', emoji: '🙏', label: 'Biết ơn' },
  { value: 'miss', emoji: '🥺', label: 'Nhớ nhau' },
  { value: 'sad', emoji: '😢', label: 'Buồn' },
];

const moodEmoji = Object.fromEntries(moodOptions.map(m => [m.value, m.emoji]));
const moodColors = {
  happy: 'bg-yellow-100 text-yellow-600',
  love: 'bg-pink-100 text-pink-600',
  excited: 'bg-orange-100 text-orange-500',
  grateful: 'bg-teal-100 text-teal-600',
  miss: 'bg-purple-100 text-purple-500',
  sad: 'bg-blue-100 text-blue-500',
};

export default function Diary() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    mood: 'love', 
    author_name: '', 
    entry_date: new Date().toISOString().split('T')[0] 
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ['diary-entries'],
    queryFn: () => diaryEntryService.list(),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => diaryEntryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] });
      setShowForm(false);
      setForm({ 
        title: '', 
        content: '', 
        mood: 'love', 
        author_name: '', 
        entry_date: new Date().toISOString().split('T')[0] 
      });
      toast.success('Đã lưu nhật ký!');
    },
    onError: (error) => {
      toast.error('Lỗi khi lưu: ' + error.message);
    }
  });

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const photoUrl = await uploadPhoto(file);
      setForm(f => ({ ...f, photo_url: photoUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-pacifico text-2xl text-primary">Nhật ký 📔</h1>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
          className="rounded-full gap-1 bg-primary text-white"
        >
          <Plus className="w-4 h-4" /> Viết
        </Button>
      </div>

      {/* New Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-5 shadow-md border border-border mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-base">Trang mới ✍️</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>

            <div className="space-y-3">
              <Input 
                placeholder="Tiêu đề..." 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                className="rounded-xl" 
              />
              <Input 
                placeholder="Tên của bạn..." 
                value={form.author_name} 
                onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} 
                className="rounded-xl" 
              />
              <Input 
                type="date" 
                value={form.entry_date} 
                onChange={e => setForm(f => ({ ...f, entry_date: e.target.value }))} 
                className="rounded-xl" 
              />

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Tâm trạng hôm nay?</p>
                <div className="flex gap-2 flex-wrap">
                  {moodOptions.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setForm(f => ({ ...f, mood: m.value }))}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${form.mood === m.value ? 'border-primary bg-primary/10' : 'border-transparent bg-muted'}`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Hôm nay chúng mình..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="rounded-xl min-h-[100px]"
              />

              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Đang upload...' : form.photo_url ? '✅ Đã thêm ảnh' : 'Thêm ảnh'}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>

              <Button
                className="w-full rounded-xl bg-primary text-white"
                onClick={() => createMutation.mutate(form)}
                disabled={!form.title || !form.content || createMutation.isPending}
              >
                {createMutation.isPending ? 'Đang lưu...' : 'Lưu trang nhật ký 💕'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📔</p>
            <p className="text-muted-foreground text-sm font-semibold">Nhật ký của các bạn vẫn còn trống</p>
            <p className="text-muted-foreground text-xs mt-1">Hãy bắt đầu viết điều gì đó nhé!</p>
          </div>
        )}
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-border"
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${moodColors[entry.mood] || 'bg-muted'}`}>
                {moodEmoji[entry.mood] || '📝'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm leading-tight">{entry.title}</h3>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {entry.entry_date ? format(parseISO(entry.entry_date), 'dd/MM/yy', { locale: vi }) : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.author_name}</p>
                <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{entry.content}</p>
                {entry.photo_url && (
                  <img src={entry.photo_url} alt="" className="w-full h-32 object-cover rounded-xl mt-2" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
