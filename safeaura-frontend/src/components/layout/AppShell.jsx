import { useState } from 'react';
import { Menu } from 'lucide-react';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AppShell({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => setSidebarOpen(true)} className="text-white">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-bold">
          {user?.fullName?.slice(0, 2).toUpperCase() || 'SA'}
        </div>
      </header>
      <main className="px-5 space-y-4">{children}</main>
      <BottomNav />
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </div>
  );
}
