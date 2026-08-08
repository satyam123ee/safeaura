import { NavLink } from 'react-router-dom';
import { Home, MapPin, Shield, Bell, User } from 'lucide-react';

const items = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/location', icon: MapPin, label: 'Location' },
  { to: '/sos', icon: Shield, label: 'SOS' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur border-t border-primary/10 flex justify-around py-3 max-w-md mx-auto z-50">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-full transition ${
              isActive
                ? label === 'SOS'
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
                  : 'text-primary'
                : 'text-muted'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
