import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Shield,
  MapPin,
  Users,
  MessageCircle,
  Bot,
  Bell,
  AlertTriangle,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/sos', icon: Shield, label: 'Emergency SOS' },
  { to: '/location', icon: MapPin, label: 'Live Location' },
  { to: '/alerts', icon: Bell, label: 'Community Alerts' },
  { to: '/profile', icon: Users, label: 'Profile & Contacts' },
];

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-primary/10 z-50 p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Shield size={20} />
            </div>
            <span className="font-bold text-lg">SafeAura</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-primary/20 text-primary' : 'text-muted hover:bg-surface/80 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-primary/10 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-white w-full">
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
