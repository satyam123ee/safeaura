import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg;
      setError(msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">Create Account</h1>
      <p className="text-muted mb-6">Join 50,000+ safe women</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="fullName"
          placeholder="Sarah Mehta"
          icon={<User size={18} />}
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="sarah@example.com"
          icon={<Mail size={18} />}
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          placeholder="9876543210"
          icon={<Phone size={18} />}
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Min 6 characters"
          icon={<Lock size={18} />}
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create My Account'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted mt-4">
        Already have one?{' '}
        <Link to="/login" className="text-primary font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
