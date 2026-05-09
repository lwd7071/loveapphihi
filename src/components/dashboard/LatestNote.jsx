import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Heart } from 'lucide-react';

export default function LatestNote({ note }) {
  if (!note) return null;

  return (
    <Link to="/notes">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 shadow-sm border border-primary/20 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{note.sticker || '💌'}</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-primary flex items-center gap-1">
              {note.from_name} <Heart className="w-3 h-3 fill-primary" /> {note.to_name}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {format(new Date(note.created_at), "dd/MM · HH:mm", { locale: vi })}
            </p>
          </div>
          {!note.is_read && (
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </div>
        <p className="text-sm font-medium leading-relaxed line-clamp-2">{note.message}</p>
      </div>
    </Link>
  );
}
