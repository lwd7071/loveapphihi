import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Save, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { coupleProfileService } from '@/lib/supabase-service';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profiles = [] } = useQuery({
    queryKey: ['couple-profile'],
    queryFn: () => coupleProfileService.list(),
  });

  const coupleProfile = profiles[0];

  const [form, setForm] = useState({
    couple_name: '',
    partner1_name: '',
    partner2_name: '',
    start_date: '',
  });

  useEffect(() => {
    if (coupleProfile) {
      setForm({
        couple_name: coupleProfile.couple_name || '',
        partner1_name: coupleProfile.partner1_name || '',
        partner2_name: coupleProfile.partner2_name || '',
        start_date: coupleProfile.start_date || '',
      });
    }
  }, [coupleProfile]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (coupleProfile) {
        return coupleProfileService.update(coupleProfile.id, data);
      } else {
        // If no couple profile exists, update the user's profile
        return coupleProfileService.update(user.id, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couple-profile'] });
      toast.success('Đã lưu thành công! 💕');
    },
    onError: (error) => {
      toast.error('Lưu thất bại: ' + error.message);
    }
  });

  const handleLogout = async () => {
    if (!window.confirm('Bạn có chắc muốn đăng xuất?')) {
      return;
    }
    
    try {
      await logout();
      toast.success('Đã đăng xuất!');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Đăng xuất thất bại: ' + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="font-pacifico text-2xl text-primary mb-6">Cài đặt ⚙️</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-border space-y-5 mb-4"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-4xl mb-3 animate-heart-beat">
            💑
          </div>
          <p className="text-sm text-muted-foreground font-semibold">Thông tin của đôi bạn</p>
          {profile && (
            <p className="text-xs text-muted-foreground mt-1">{profile.username} ({profile.role})</p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">
            Tên đôi (vd: "Anh & Em")
          </label>
          <Input
            placeholder="Couple name..."
            value={form.couple_name}
            onChange={e => setForm(f => ({ ...f, couple_name: e.target.value }))}
            className="rounded-xl"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Tên người 1 💙</label>
            <Input
              placeholder="Anh..."
              value={form.partner1_name}
              onChange={e => setForm(f => ({ ...f, partner1_name: e.target.value }))}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end pb-1">
            <Heart className="w-5 h-5 text-primary fill-primary animate-heart-beat" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Tên người 2 🩷</label>
            <Input
              placeholder="Em..."
              value={form.partner2_name}
              onChange={e => setForm(f => ({ ...f, partner2_name: e.target.value }))}
              className="rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Ngày bắt đầu yêu 📅</label>
          <Input
            type="date"
            value={form.start_date}
            onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
            className="rounded-xl"
          />
        </div>

        <Button
          className="w-full rounded-xl gap-2"
          style={{ background: 'linear-gradient(135deg, hsl(340,80%,60%), hsl(280,60%,65%))' }}
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin 💕'}
        </Button>
      </motion.div>

      {/* Authentication UI removed for auto-login */}
    </div>
  );
}
