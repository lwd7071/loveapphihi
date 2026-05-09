import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Diary from '@/pages/Diary';
import LoveNotes from '@/pages/LoveNotes';
import Memories from '@/pages/Memories';
import BucketList from '@/pages/BucketList';
import Timeline from '@/pages/Timeline';
import Settings from '@/pages/Settings';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/notes" element={<LoveNotes />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/bucket" element={<BucketList />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
          <Sonner richColors position="top-center" />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App