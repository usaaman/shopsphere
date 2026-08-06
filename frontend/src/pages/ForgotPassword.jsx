import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';
import api from '../api/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      showToast('Passwords do not match', 'danger');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email, password });
      setMessage(data.message || 'Password reset successful');
      showToast('Password updated successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      showToast(err.response?.data?.message || 'Update failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        className="bg-white border border-border-light p-8 rounded-3xl shadow-sm"
      >
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mb-2">Reset Password</h1>
        <p className="text-xs text-text-secondary mb-6 font-light">
          Enter email and define new password parameters below to recover credentials.
        </p>

        {message && <p className="bg-green-50 text-success text-xs p-3.5 rounded-xl mb-4 font-medium">{message}</p>}
        {error && <p className="bg-red-50 text-danger text-xs p-3.5 rounded-xl mb-4 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
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

          {/* New Password */}
          <div className="relative border border-border-light focus-within:border-primary-start rounded-2xl p-3 bg-bg-soft/50 focus-within:bg-white transition-all">
            <label className="block text-[8px] font-bold text-text-secondary uppercase tracking-widest mb-1 select-none">
              New Password
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

          {/* Confirm Password */}
          <div className="relative border border-border-light focus-within:border-primary-start rounded-2xl p-3 bg-bg-soft/50 focus-within:bg-white transition-all">
            <label className="block text-[8px] font-bold text-text-secondary uppercase tracking-widest mb-1 select-none">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs focus:outline-none focus:ring-0 text-text-primary placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest p-3.5 rounded-full transition duration-150 disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-6 font-light">
          Remember credentials?{' '}
          <Link to="/login" className="text-primary-start hover:underline font-bold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
