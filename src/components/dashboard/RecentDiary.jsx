import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

const moodEmoji = {
  happy: '😄',
  love: '🥰',
  excited: '🤩',
  grateful: '🙏',
  miss: '🥺',
  sad: '😢',
};

export default function RecentDiary({ entries = [] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">Nhật ký gần đây 📔</h3>
        <Link to="/diary" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
          Xem tất cả <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-3xl mb-2">📔</p>
          <p className="text-xs text-muted-foreground">Chưa có nhật ký nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="flex gap-2 p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <span className="text-xl flex-shrink-0">{moodEmoji[entry.mood] || '📝'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs truncate">{entry.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {entry.author_name} • {entry.entry_date ? format(parseISO(entry.entry_date), 'dd/MM', { locale: vi }) : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
