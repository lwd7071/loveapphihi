import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Image, List, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Trang chủ' },
  { path: '/diary', icon: BookOpen, label: 'Nhật ký' },
  { path: '/notes', icon: Heart, label: 'Love Note' },
  { path: '/memories', icon: Image, label: 'Kỷ niệm' },
  { path: '/bucket', icon: List, label: 'Bucket List' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200",
                  active
                    ? "text-primary scale-110"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "fill-primary/20")} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}