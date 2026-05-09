import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MemoryDetailModal from '@/components/memories/MemoryDetailModal';
import { memoryService, uploadPhoto } from '@/lib/supabase-service';
import { useAuth } from '@/lib/AuthContext';

const categoryLabel = {
  first_time: { label: 'Lần đầu', emoji: '🌟', color: 'bg-yellow-100 text-yellow-600' },
  travel: { label: 'Du lịch', emoji: '✈️', color: 'bg-blue-100 text-blue-600' },
  anniversary: { label: 'Kỷ niệm', emoji: '🎉', color: 'bg-pink-100 text-pink-600' },
  daily: { label: 'Hằng ngày', emoji: '☀️', color: 'bg-orange-100 text-orange-500' },
  special: { label: 'Đặc biệt', emoji: '💫', color: 'bg-purple-100 text-purple-500' },
};

export default function Memories() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    memory_date: new Date().toISOString().split('T')[0], 
    category: 'special', 
    photos: [] 
  });
  const [uploading, setUploading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const queryClient = useQueryClient();

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.list(),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => memoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      setShowForm(false);
      setForm({ 
        title: '', 
        description: '', 
        memory_date: new Date().toISOString().split('T')[0], 
        category: 'special', 
        photos: [] 
      });
    }
  });

  const toggleFavMutation = useMutation({
    mutationFn: ({ id, is_favorite }) => memoryService.update(id, { is_favorite: !is_favorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      // update selected memory in modal if open
      setSelectedMemory(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
    }
  });

  // Upload multiple photos one at a time
  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const photoUrl = await uploadPhoto(file);
        setForm(f => ({ ...f, photos: [...(f.photos || []), photoUrl] }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-pacifico text-2xl text-primary">Kỷ niệm 📸</h1>
        <Button onClick={() => setShowForm(true)} size="sm" className="rounded-full gap-1">
          <Plus className="w-4 h-4" /> Thêm
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-5 shadow-md border border-border mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm">Lưu kỷ niệm mới ✨</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <Input 
                placeholder="Tên kỷ niệm..." 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                className="rounded-xl" 
              />
              <Input 
                type="date" 
                value={form.memory_date} 
                onChange={e => setForm(f => ({ ...f, memory_date: e.target.value }))} 
                className="rounded-xl" 
              />
              <div className="flex gap-2 flex-wrap">
                {Object.entries(categoryLabel).map(([val, { label, emoji }]) => (
                  <button 
                    key={val} 
                    onClick={() => setForm(f => ({ ...f, category: val }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${form.category === val ? 'border-primary bg-primary/10' : 'border-transparent bg-muted'}`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
              <Textarea 
                placeholder="Mô tả kỷ niệm..." 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                className="rounded-xl" 
              />

              {/* Multi-photo upload */}
              <div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors w-fit">
                  <span>📷</span>
                  <span className="font-semibold">
                    {uploading ? 'Đang upload...' : 'Thêm nhiều ảnh'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handlePhotos} 
                    disabled={uploading} 
                  />
                </label>
                <p className="text-[10px] text-muted-foreground mt-0.5">Có thể chọn nhiều ảnh cùng lúc</p>
              </div>

              {form.photos?.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {form.photos.map((url, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                className="w-full rounded-xl" 
                onClick={() => createMutation.mutate(form)} 
                disabled={!form.title || createMutation.isPending || uploading}
              >
                {createMutation.isPending ? 'Đang lưu...' : 'Lưu kỷ niệm 💕'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {memories.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <p className="text-4xl mb-3">📸</p>
            <p className="text-muted-foreground text-sm font-semibold">Chưa có kỷ niệm nào</p>
          </div>
        )}
        {memories.map((memory, i) => {
          const cat = categoryLabel[memory.category] || { label: 'Đặc biệt', emoji: '💫', color: 'bg-muted' };
          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedMemory(memory)}
            >
              {memory.photos?.[0]
                ? <div className="relative">
                    <img src={memory.photos[0]} alt={memory.title} className="w-full h-32 object-cover" />
                    {memory.photos.length > 1 && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        +{memory.photos.length - 1}
                      </div>
                    )}
                  </div>
                : <div className="w-full h-20 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-4xl">{cat.emoji}</div>
              }
              <div className="p-3">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-bold text-xs leading-tight flex-1">{memory.title}</h3>
                  <button 
                    onClick={e => { 
                      e.stopPropagation(); 
                      toggleFavMutation.mutate({ id: memory.id, is_favorite: memory.is_favorite }); 
                    }}
                  >
                    <Star className={`w-4 h-4 ${memory.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {memory.memory_date ? format(parseISO(memory.memory_date), 'dd/MM/yyyy', { locale: vi }) : ''}
                </p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color}`}>
                  {cat.emoji} {cat.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onToggleFav={(mem) => toggleFavMutation.mutate({ id: mem.id, is_favorite: mem.is_favorite })}
        />
      )}
    </div>
  );
}
