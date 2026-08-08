import { Link } from 'react-router-dom';
import { Shield, MapPin, Bot } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
        <Shield size={36} />
      </div>
      <h1 className="text-4xl font-extrabold leading-tight mb-4">
        Your Safety,
        <br />
        Our Priority
      </h1>
      <p className="text-muted mb-8 max-w-sm">
        SafeAura empowers women with real-time protection tools, community support, and
        intelligent safety assistance.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-sm">
        {[
          { icon: Shield, label: 'SOS Alert' },
          { icon: MapPin, label: 'Live Track' },
          { icon: Bot, label: 'AI Guard' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="bg-surface/60 border border-primary/20 rounded-2xl py-4 flex flex-col items-center gap-2"
          >
            <Icon size={20} className="text-primary" />
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
      <Link
        to="/register"
        className="w-full max-w-sm bg-brand-gradient py-4 rounded-2xl font-semibold mb-3 block"
      >
        Get Started — It&apos;s Free
      </Link>
      <Link
        to="/login"
        className="w-full max-w-sm border border-primary/30 py-4 rounded-2xl font-semibold block"
      >
        Sign In
      </Link>
      <p className="text-xs text-muted mt-6">Trusted by 50,000+ women across India</p>
    </div>
  );
}
