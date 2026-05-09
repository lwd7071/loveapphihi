import { Link } from 'react-router-dom';
import { BookHeart, MessageCircleHeart, Camera, ListChecks } from 'lucide-react';

const actions = [
  { icon: BookHeart, label: 'Nhật ký', to: '/diary', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: MessageCircleHeart, label: 'Love Notes', to: '/notes', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Camera, label: 'Kỷ niệm', to: '/memories', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: ListChecks, label: 'Bucket List', to: '/bucket', color: 'text-orange-500', bg: 'bg-orange-50' },
];

export default function QuickActions() {
  return (
    <div>
      <h3 className="font-bold text-sm mb-3">Làm gì hôm nay? 💭</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <span className="text-[10px] font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
