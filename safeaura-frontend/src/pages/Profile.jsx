import { useEffect, useState } from 'react';
import { User, Phone, Plus, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(50);
  const [contacts, setContacts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'Friend' });
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [scoreRes, contactsRes] = await Promise.all([
        api.get('/users/safety-score'),
        api.get('/contacts'),
      ]);
      setScore(scoreRes.data.score);
      setContacts(contactsRes.data);
    } catch {
      /* keep defaults */
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contacts', newContact);
      setNewContact({ name: '', phone: '', relation: 'Friend' });
      setShowAdd(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/contacts/${id}`);
    loadData();
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell title="Profile">
      <div className="bg-surface/60 border border-primary/10 rounded-2xl p-5 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-2xl mx-auto mb-3">
          {user?.fullName?.[0]?.toUpperCase()}
        </div>
        <p className="font-bold text-lg">{user?.fullName}</p>
        <p className="text-muted text-sm">{user?.email}</p>
      </div>

      <div className="bg-surface/60 border border-primary/10 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Safety Score</p>
          <p className="text-primary font-bold">{score}%</p>
        </div>
        <div className="h-2 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gradient rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">Add contacts and report incidents to improve your score.</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-primary text-sm font-semibold">Trusted Contacts</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-sm text-primary"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddContact} className="bg-surface/60 border border-primary/10 rounded-2xl p-4 space-y-3">
          <Input
            placeholder="Contact name"
            icon={<User size={18} />}
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            required
          />
          <Input
            placeholder="Phone number"
            icon={<Phone size={18} />}
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            required
          />
          <Input
            placeholder="Relation (e.g. Friend, Sister)"
            value={newContact.relation}
            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit">Save Contact</Button>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="text-muted text-sm text-center py-4">No trusted contacts yet.</p>
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
                <p className="text-xs text-muted">{c.relation} · {c.phone}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(c._id)} className="text-red-400 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}

      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/30 text-red-400 mt-4"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </AppShell>
  );
}
