import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import api from '../api/axiosInstance';

const tabs = ['All', 'Nearby', 'Warnings', 'Safe Zones'];

export default function CommunityAlerts() {
  const [activeTab, setActiveTab] = useState('All');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filterMap = { All: '', Nearby: 'nearby', Warnings: 'warnings', 'Safe Zones': 'safe_zones' };
    setLoading(true);
    api
      .get(`/community-alerts?filter=${filterMap[activeTab]}`)
      .then(({ data }) => setAlerts(data))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <AppShell title="Community Alerts">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              activeTab === t ? 'bg-brand-gradient text-white' : 'bg-surface/60 text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted text-center py-8">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-muted text-center py-8">No alerts in this category.</p>
      ) : (
        alerts.map((a) => (
          <div key={a._id} className="bg-surface/60 border border-primary/10 rounded-2xl p-4">
            <div className="flex justify-between items-start gap-2">
              <p className="font-semibold">{a.title}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                  a.type === 'WARNING'
                    ? 'bg-orange-500/20 text-orange-400'
                    : a.type === 'SAFE_ZONE'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {a.type === 'WARNING' ? 'Alert' : a.type === 'SAFE_ZONE' ? 'Safe' : 'Info'}
              </span>
            </div>
            {a.description && <p className="text-sm text-muted mt-2">{a.description}</p>}
            <p className="text-xs text-muted mt-1">{a.location?.address}</p>
            <p className="text-xs text-muted mt-1">♥ {a.likes}</p>
          </div>
        ))
      )}
    </AppShell>
  );
}
