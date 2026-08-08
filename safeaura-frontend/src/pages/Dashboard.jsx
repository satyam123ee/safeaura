import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Users,
  Bell,
  Star,
  MapPin,
  Route,
  Building2,
  Bot,
  MessageCircle,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-surface/60 border border-primary/10 rounded-2xl p-4 text-center">
      <Icon size={18} className="mx-auto mb-1 text-primary" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

const quickLinks = [
  { to: '/location', icon: MapPin, label: 'Live Location' },
  { to: '/sos', icon: Shield, label: 'Emergency SOS' },
  { to: '/alerts', icon: Bell, label: 'Community Alerts' },
  { to: '/profile', icon: Users, label: 'My Contacts' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ contacts: 0, alertsNearby: 0, safetyScore: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [contactsRes, scoreRes, alertsRes] = await Promise.allSettled([
          api.get('/contacts'),
          api.get('/users/safety-score'),
          api.get('/community-alerts?filter=nearby'),
        ]);
        setStats({
          contacts: contactsRes.status === 'fulfilled' ? contactsRes.value.data.length : 0,
          safetyScore: scoreRes.status === 'fulfilled' ? scoreRes.value.data.score : 50,
          alertsNearby: alertsRes.status === 'fulfilled' ? alertsRes.value.data.length : 0,
        });
      } catch {
        /* keep defaults */
      }
    })();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell title="Dashboard">
      <div className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center font-bold text-lg">
          {user?.fullName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-muted text-sm">{greeting()},</p>
          <p className="font-bold">{user?.fullName}</p>
          <p className="text-xs text-green-400">● Protected &amp; Safe</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/sos')}
        className="w-full bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-red-500/20"
      >
        <div className="flex items-center gap-3">
          <Shield size={28} />
          <div className="text-left">
            <p className="font-bold">Emergency SOS</p>
            <p className="text-xs text-white/80">Tap to alert your contacts instantly</p>
          </div>
        </div>
        <AlertTriangle size={22} />
      </button>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Users} value={stats.contacts} label="Contacts" />
        <StatCard icon={Bell} value={stats.alertsNearby} label="Alerts Nearby" />
        <StatCard icon={Star} value={`${stats.safetyScore}%`} label="Safety Score" />
      </div>

      <p className="text-primary text-sm font-semibold">Quick Access</p>
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition"
          >
            <Icon size={20} className="text-primary" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
