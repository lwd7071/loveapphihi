import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import DaysCounter from '@/components/dashboard/DaysCounter';
import AnniversaryCard from '@/components/dashboard/AnniversaryCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentDiary from '@/components/dashboard/RecentDiary';
import LatestNote from '@/components/dashboard/LatestNote';
import { motion } from 'framer-motion';
import { coupleProfileService, diaryEntryService, loveNoteService } from '@/lib/supabase-service';
export default function Dashboard() {
  const { data: profiles = [] } = useQuery({
    queryKey: ['couple-profile'],
    queryFn: () => coupleProfileService.list(),
  });

  const { data: diaryEntries = [] } = useQuery({
    queryKey: ['diary-entries'],
    queryFn: () => diaryEntryService.list(5),
  });

  const { data: loveNotes = [] } = useQuery({
    queryKey: ['love-notes'],
    queryFn: () => loveNoteService.list(1),
  });

  const profile = profiles[0];
  const latestNote = loveNotes[0];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5">
        
        <div>
          <h1 className="font-pacifico text-2xl text-primary">Our Notebook</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            {profile?.couple_name || '💕 Couple Notebook'}
          </p>
        </div>
        <Link to="/settings" className="w-9 h-9 bg-white rounded-full shadow-sm border border-border flex items-center justify-center hover:scale-105 transition-transform">
          <Settings className="w-4 h-4 text-muted-foreground" />
        </Link>
      </motion.div>

      <div className="space-y-4">
        {/* Days Counter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DaysCounter
            startDate={profile?.start_date}
            partnerName1={profile?.partner1_name}
            partnerName2={profile?.partner2_name} />
          
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <QuickActions />
          </div>
        </motion.div>

        {/* Anniversary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AnniversaryCard startDate={profile?.start_date} />
        </motion.div>

        {/* Latest Love Note */}
        {latestNote &&
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <LatestNote note={latestNote} />
          </motion.div>
        }

        {/* Recent Diary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <RecentDiary entries={diaryEntries} />
        </motion.div>

        {/* Footer */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">Love You Everyday</p>
        </div>
      </div>
    </div>);

}
