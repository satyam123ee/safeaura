import { useRef, useState } from 'react';
import { Shield, Phone } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import api from '../api/axiosInstance';

const quickDial = [
  { name: 'Police', number: '100' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Ambulance', number: '108' },
];

export default function EmergencySOS() {
  const [holding, setHolding] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const startHold = () => {
    setHolding(true);
    setSent(false);
    setError('');
    timerRef.current = setTimeout(triggerSOS, 1500);
  };

  const cancelHold = () => {
    setHolding(false);
    clearTimeout(timerRef.current);
  };

  const triggerSOS = async () => {
    setHolding(false);
    if (!navigator.geolocation) {
      setError('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.post('/alerts/sos', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setSent(true);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to send SOS');
        }
      },
      () => setError('Could not get your location')
    );
  };

  return (
    <AppShell title="Emergency SOS">
      <div className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <div>
          <p className="font-semibold">Safe Mode Active</p>
          <p className="text-xs text-muted">Press &amp; hold to trigger emergency</p>
        </div>
      </div>

      <div className="flex justify-center py-10">
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className={`w-40 h-40 rounded-full bg-brand-gradient flex flex-col items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.4)] transition-transform select-none ${holding ? 'scale-95' : ''}`}
        >
          <Shield size={40} />
          <span className="font-bold mt-1">{holding ? 'Hold...' : 'SOS'}</span>
        </button>
      </div>

      {sent && (
        <p className="text-center text-green-400 text-sm font-medium">
          Alert sent to your trusted contacts.
        </p>
      )}
      {error && <p className="text-center text-red-400 text-sm">{error}</p>}

      <p className="text-primary text-sm font-semibold">Quick Dial</p>
      <div className="space-y-2">
        {quickDial.map((c) => (
          <a
            key={c.name}
            href={`tel:${c.number}`}
            className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center justify-between block"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone size={16} />
              </div>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted">{c.number}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
