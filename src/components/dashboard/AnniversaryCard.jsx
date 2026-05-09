import { differenceInDays, addMonths, parseISO, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

export default function AnniversaryCard({ startDate }) {
  if (!startDate) return null;

  const start = parseISO(startDate);
  const today = new Date();
  const totalDays = differenceInDays(today, start);
  const months = Math.floor(totalDays / 30);
  
  // Calculate next milestone (every month)
  const nextMilestone = addMonths(start, months + 1);
  const daysUntilNext = differenceInDays(nextMilestone, today);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-sm">Kỷ niệm sắp tới</h3>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3">
        <p className="text-xs text-muted-foreground mb-1">Tròn {months + 1} tháng</p>
        <p className="font-bold text-lg text-primary">
          {format(nextMilestone, 'dd MMMM yyyy', { locale: vi })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Còn <span className="font-bold text-primary">{daysUntilNext}</span> ngày nữa 🎉
        </p>
      </div>
    </div>
  );
}
