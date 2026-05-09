import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { bucketListService } from '@/lib/supabase-service';
import { useAuth } from '@/lib/AuthContext';

const categoryOptions = [
  { value: 'travel', emoji: '✈️', label: 'Du lịch' },
  { value: 'food', emoji: '🍜', label: 'Ẩm thực' },
  { value: 'activity', emoji: '🎮', label: 'Hoạt động' },
  { value: 'milestone', emoji: '🏆', label: 'Cột mốc' },
  { value: 'other', emoji: '🎯', label: 'Khác' },
];

export default function BucketList() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'activity', emoji: '🎯' });
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['bucket-items'],
    queryFn: () => bucketListService.list(),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => bucketListService.create({
      ...data,
      is_done: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-items'] });
      setShowForm(false);
      setForm({ title: '', description: '', category: 'activity', emoji: '🎯' });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_done }) => bucketListService.update(id, {
      is_done: !is_done,
      done_date: !is_done ? new Date().toISOString().split('T')[0] : null,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bucket-items'] })
  });

  const done = items.filter(i => i.is_done);
  const todo = items.filter(i => !i.is_done);
  const progress = items.length ? Math.round((done.length / items.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pacifico text-2xl text-primary">Bucket List 🎯</h1>
        <Button onClick={() => setShowForm(true)} size="sm" className="rounded-full gap-1">
          <Plus className="w-4 h-4" /> Thêm
        </Button>
      </div>

      {items.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-4">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-muted-foreground">Đã làm được {done.length}/{items.length} điều 🎉</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(340,80%,60%), hsl(280,60%,65%))' }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-5 shadow-md border border-border mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm">Thêm điều mới 🌟</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  placeholder="Emoji..." 
                  value={form.emoji} 
                  onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} 
                  className="rounded-xl w-20 text-center text-xl" 
                />
                <Input 
                  placeholder="Muốn làm gì nào..." 
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  className="rounded-xl flex-1" 
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categoryOptions.map(c => (
                  <button 
                    key={c.value} 
                    onClick={() => setForm(f => ({ ...f, category: c.value, emoji: c.emoji }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${form.category === c.value ? 'border-primary bg-primary/10' : 'border-transparent bg-muted'}`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
              <Textarea 
                placeholder="Mô tả thêm..." 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                className="rounded-xl" 
              />
              <Button 
                className="w-full rounded-xl" 
                onClick={() => createMutation.mutate(form)} 
                disabled={!form.title || createMutation.isPending}
              >
                {createMutation.isPending ? 'Đang thêm...' : 'Thêm vào danh sách 💕'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-muted-foreground text-sm font-semibold">Bucket list còn trống</p>
            <p className="text-muted-foreground text-xs mt-1">Hãy lên kế hoạch những điều muốn làm nhé!</p>
          </div>
        )}
        {todo.map((item, i) => (
          <BucketItemCard 
            key={item.id} 
            item={item} 
            index={i} 
            onToggle={() => toggleMutation.mutate({ id: item.id, is_done: item.is_done })} 
          />
        ))}
        {done.length > 0 && (
          <>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide pt-2 pb-1">
              ✅ Đã hoàn thành ({done.length})
            </p>
            {done.map((item, i) => (
              <BucketItemCard 
                key={item.id} 
                item={item} 
                index={i} 
                onToggle={() => toggleMutation.mutate({ id: item.id, is_done: item.is_done })} 
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function BucketItemCard({ item, index, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-3 p-4 rounded-2xl shadow-sm border transition-all ${
        item.is_done ? 'bg-muted border-border opacity-60' : 'bg-white border-border'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item.is_done ? 'bg-primary border-primary' : 'border-border hover:border-primary'
        }`}
      >
        {item.is_done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </button>
      <span className="text-xl flex-shrink-0">{item.emoji || '🎯'}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm ${item.is_done ? 'line-through text-muted-foreground' : ''}`}>
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
        {item.done_date && (
          <p className="text-[10px] text-primary font-semibold mt-0.5">
            ✓ {new Date(item.done_date).toLocaleDateString('vi-VN')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
