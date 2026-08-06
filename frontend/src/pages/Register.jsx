import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-gray-150', width: 'w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-danger', width: 'w-1/3' };
    const hasNumbers = /\D/.test(password) && /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasNumbers && hasSpecial) {
      return { label: 'Strong', color: 'bg-success', width: 'w-full' };
    }
    return { label: 'Medium', color: 'bg-warning', width: 'w-2/3' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      showToast('Account registered successfully', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      showToast(err.response?.data?.message || 'Registration failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-md mx-auto my-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-border-light p-8 rounded-3xl shadow-sm"
      >
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mb-2">Create account</h1>
        <p className="text-xs text-text-secondary mb-6 font-light">Register credentials to start managing order logs.</p>

        {error && <p className="bg-red-50 text-danger text-xs p-3.5 rounded-xl mb-5 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Floating outline input: Name */}
          <div className="relative border border-border-light focus-within:border-primary-start rounded-2xl p-3 bg-bg-soft/50 focus-within:bg-white transition-all">
            <label className="block text-[8px] font-bold text-text-secondary uppercase tracking-widest mb-1 select-none">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none focus:ring-0 text-text-primary placeholder-gray-400"
              required
            />
          </div>

          {/* Floating outline input: Email */}
          <div className="relative border border-border-light focus-within:border-primary-start rounded-2xl p-3 bg-bg-soft/50 focus-within:bg-white transition-all">
            <label className="block text-[8px] font-bold text-text-secondary uppercase tracking-widest mb-1 select-none">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none focus:ring-0 text-text-primary placeholder-gray-400"
              required
            />
          </div>

          {/* Floating outline input: Password */}
          <div className="relative border border-border-light focus-within:border-primary-start rounded-2xl p-3 bg-bg-soft/50 focus-within:bg-white transition-all">
            <label className="block text-[8px] font-bold text-text-secondary uppercase tracking-widest mb-1 select-none">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none focus:ring-0 text-text-primary placeholder-gray-400"
              required
            />
          </div>

          {/* Password strength bar */}
          {password && (
            <div className="flex flex-col gap-1.5 px-1">
              <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase">
                <span>Strength:</span>
                <span className="text-text-primary">{strength.label}</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest p-3.5 rounded-full transition duration-150 disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Social auth */}
        <div className="flex flex-col gap-3 mt-6 border-t border-border-light pt-6">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest text-center">Or register with</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => showToast('Social authentication placeholder', 'warning')}
              className="flex items-center justify-center gap-2 border border-border-light rounded-full py-2.5 text-xs font-semibold hover:bg-bg-soft transition"
            >
              <span className="text-sm">🍏</span> Apple
            </button>
            <button
              onClick={() => showToast('Social authentication placeholder', 'warning')}
              className="flex items-center justify-center gap-2 border border-border-light rounded-full py-2.5 text-xs font-semibold hover:bg-bg-soft transition"
            >
              <span className="text-sm">🌐</span> Google
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-text-secondary mt-6 font-light">
          Already registered?{' '}
          <Link to="/login" className="text-primary-start hover:underline font-bold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;