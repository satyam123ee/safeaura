import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import AppShell from '../components/layout/AppShell';
import api from '../api/axiosInstance';
import { connectSocket } from '../sockets/socket';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LiveLocation() {
  const [position, setPosition] = useState({ lat: 12.9716, lng: 77.5946 });
  const [sharing, setSharing] = useState(true);
  const [contacts, setContacts] = useState([]);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    api.get('/contacts').then(({ data }) => setContacts(data)).catch(() => {});

    socketRef.current = connectSocket();

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(coords);
          if (sharing) socketRef.current?.emit('location:update', coords);
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      socketRef.current?.disconnect();
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [sharing]);

  return (
    <AppShell title="Live Location">
      <div className="rounded-2xl overflow-hidden h-56 border border-primary/10">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
          key={`${position.lat}-${position.lng}`}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[position.lat, position.lng]} />
        </MapContainer>
      </div>

      <div className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Live Location Sharing</p>
          <p className="text-xs text-muted">Shared with {contacts.length} trusted contacts</p>
        </div>
        <button
          onClick={() => setSharing((s) => !s)}
          className={`w-12 h-7 rounded-full transition relative ${sharing ? 'bg-brand-gradient' : 'bg-surface border border-primary/20'}`}
          aria-label="Toggle location sharing"
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${sharing ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      <p className="text-primary text-sm font-semibold">Sharing With</p>
      {contacts.length === 0 ? (
        <p className="text-muted text-sm text-center py-4">No trusted contacts yet. Add some in Profile.</p>
      ) : (
        contacts.map((c) => (
          <div
            key={c._id}
            className="bg-surface/60 border border-primary/10 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center font-bold">
                {c.name[0]}
              </div>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted">{c.relation}</p>
              </div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${c.isLive ? 'bg-green-500/20 text-green-400' : 'bg-surface text-muted'}`}
            >
              {c.isLive ? 'Live' : 'Offline'}
            </span>
          </div>
        ))
      )}
    </AppShell>
  );
}
