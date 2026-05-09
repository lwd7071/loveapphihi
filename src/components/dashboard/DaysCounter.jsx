import { differenceInDays, parseISO } from 'date-fns';
import { Heart } from 'lucide-react';

export default function DaysCounter({ startDate, partnerName1, partnerName2 }) {
  if (!startDate) {
    return (
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-6 text-center shadow-sm border border-border">
        <p className="text-sm text-muted-foreground font-semibold">Chưa có ngày bắt đầu</p>
        <p className="text-xs text-muted-foreground mt-1">Hãy cập nhật trong Settings</p>
      </div>
    );
  }

  const days = differenceInDays(new Date(), parseISO(startDate));

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-6 text-center shadow-sm border border-border relative overflow-hidden">
      {/* Decorative hearts */}
      <div className="absolute top-2 right-2 text-pink-300 opacity-50">
        <Heart className="w-6 h-6 fill-current animate-pulse" />
      </div>
      <div className="absolute bottom-2 left-2 text-purple-300 opacity-50">
        <Heart className="w-4 h-4 fill-current animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
        {partnerName1 && partnerName2 ? `${partnerName1} 💕 ${partnerName2}` : 'Chúng mình'}
      </p>
      
      <div className="relative">
        <p className="text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
          {days}
        </p>
        <p className="text-sm font-bold text-muted-foreground">ngày bên nhau</p>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Từ {new Date(startDate).toLocaleDateString('vi-VN')}
      </p>
    </div>
  );
}
