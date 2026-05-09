import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { memoryService } from '@/lib/supabase-service';
import { useAuth } from '@/lib/AuthContext';

const categoryLabel = {
  first_time: { emoji: '🌟', color: 'bg-yellow-100 text-yellow-600', dot: 'bg-yellow-400' },
  travel: { emoji: '✈️', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400' },
  anniversary: { emoji: '🎉', color: 'bg-pink-100 text-pink-600', dot: 'bg-primary' },
  daily: { emoji: '☀️', color: 'bg-orange-100 text-orange-500', dot: 'bg-orange-400' },
  special: { emoji: '💫', color: 'bg-purple-100 text-purple-500', dot: 'bg-purple-400' },
};

export default function Timeline() {
  const { user } = useAuth();

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.list(),
    enabled: !!user
  });

  const sorted = [...memories].sort((a, b) =>
    new Date(a.memory_date) - new Date(b.memory_date)
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="font-pacifico text-2xl text-primary mb-6">Timeline 🕰️</h1>

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4 animate-float">🕰️</p>
          <p className="text-muted-foreground font-semibold">Chưa có kỷ niệm nào</p>
          <p className="text-muted-foreground text-xs mt-1">Hãy thêm kỷ niệm ở trang Kỷ niệm nhé!</p>
        </div>
      )}

      <div className="relative">
        {/* Vertical line */}
        {sorted.length > 0 && (
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20 rounded-full" />
        )}

        <div className="space-y-5 pl-14">
          {sorted.map((memory, i) => {
            const cat = categoryLabel[memory.category] || { emoji: '💫', color: 'bg-muted', dot: 'bg-muted-foreground' };
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                {/* Dot */}
                <div className={`absolute -left-[2.15rem] top-3 w-4 h-4 ${cat.dot} rounded-full border-2 border-white shadow-sm z-10`} />

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <h3 className="font-bold text-sm">{memory.title}</h3>
                      {memory.is_favorite && <span>⭐</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color} flex-shrink-0`}>
                      {memory.memory_date ? format(parseISO(memory.memory_date), 'dd/MM/yy', { locale: vi }) : ''}
                    </span>
                  </div>

                  {memory.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{memory.description}</p>
                  )}

                  {memory.photos?.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {memory.photos.map((url, j) => (
                        <img key={j} src={url} alt="" className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
