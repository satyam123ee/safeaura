import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-md mx-auto flex flex-col justify-center">
      <h1 className="text-3xl font-extrabold mb-1">Welcome Back</h1>
      <p className="text-muted mb-6">Sign in to continue protecting yourself</p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          name="password"
          type="password"
          placeholder="Your password"
          icon={<Lock size={18} />}
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted mt-4">
        New here?{' '}
        <Link to="/register" className="text-primary font-semibold">
          Create account
        </Link>
      </p>
    </div>
  );
}
