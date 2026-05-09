import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { loveNoteService } from '@/lib/supabase-service';

const stickers = ['💌', '🥰', '💕', '🌹', '🫶', '✨', '🦋', '🍓', '🌙', '⭐'];

export default function LoveNotes() {
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('💌');
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ['love-notes'],
    queryFn: () => loveNoteService.list(),
  });

  // Realtime subscription
  useEffect(() => {
    const unsubscribe = loveNoteService.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['love-notes'] });
    });
    
    return unsubscribe;
  }, [queryClient]);

  const sendMutation = useMutation({
    mutationFn: (data) => loveNoteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['love-notes'] });
      setMessage('');
      toast.success('Đã gửi tin nhắn bí mật! 💌');
    },
    onError: (error) => toast.error('Lỗi khi gửi: ' + error.message)
  });

  const markReadMutation = useMutation({
    mutationFn: ({ id }) => loveNoteService.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['love-notes'] });
    },
    onError: (error) => toast.error('Lỗi: ' + error.message)
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      message: message.trim(),
      from_name: fromName || 'Anh/Em',
      to_name: toName || 'Em/Anh',
      sticker: selectedSticker,
      is_read: false
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-pacifico text-2xl text-primary mb-5">Love Notes 💌</h1>

      {/* Send Form */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-border mb-5">
        <h2 className="font-bold text-sm mb-3">Gửi tin nhắn bí mật 🤫</h2>

        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Từ..." 
            value={fromName} 
            onChange={e => setFromName(e.target.value)} 
            className="rounded-xl" 
          />
          <Input 
            placeholder="Gửi tới..." 
            value={toName} 
            onChange={e => setToName(e.target.value)} 
            className="rounded-xl" 
          />
        </div>

        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Chọn sticker</p>
          <div className="flex gap-2 flex-wrap">
            {stickers.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSticker(s)}
                className={`w-9 h-9 rounded-xl text-xl transition-all ${selectedSticker === s ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'bg-muted hover:scale-110'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Nhắn gì cho người ấy đi... 💕"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="rounded-xl min-h-[80px] mb-3"
        />

        <Button
          className="w-full rounded-xl gap-2"
          style={{ background: 'linear-gradient(135deg, hsl(340,80%,60%), hsl(280,60%,65%))' }}
          onClick={handleSend}
          disabled={!message.trim() || sendMutation.isPending}
        >
          <Send className="w-4 h-4" />
          {sendMutation.isPending ? 'Đang gửi...' : 'Gửi đi 💌'}
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-3 animate-float">💌</p>
            <p className="text-muted-foreground text-sm font-semibold">Chưa có tin nhắn nào</p>
            <p className="text-muted-foreground text-xs mt-1">Hãy nhắn gì đó ngọt ngào đi!</p>
          </div>
        )}
        <AnimatePresence>
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl p-4 ${note.is_read ? 'bg-white border border-border' : 'bg-gradient-to-r from-pink-50 to-purple-50 border border-primary/20'}`}
              onClick={() => !note.is_read && markReadMutation.mutate({ id: note.id })}
            >
              {!note.is_read && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              )}
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{note.sticker || '💌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-primary">{note.from_name}</span>
                    <Heart className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-bold text-secondary">{note.to_name}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{note.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(note.created_at), "dd/MM · HH:mm", { locale: vi })}
                    {!note.is_read && <span className="ml-2 text-primary font-bold">• Mới</span>}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
