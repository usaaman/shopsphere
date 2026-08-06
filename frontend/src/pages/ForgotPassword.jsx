import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email, password });
      setMessage(data.message || 'Password reset successful');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#ECECEC] p-8 rounded-3xl shadow-sm"
      >
        <h1 className="text-2xl font-serif font-bold text-primary mb-2">Reset Password</h1>
        <p className="text-xs text-gray-500 mb-6 font-light">
          Enter your email and define your new password below to regain account access.
        </p>

        {message && <p className="bg-green-50 text-green-700 text-xs p-3 rounded-xl mb-4 font-medium">{message}</p>}
        {error && <p className="bg-red-50 text-[#E24A4A] text-xs p-3 rounded-xl mb-4 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest p-3.5 rounded-full transition duration-150 disabled:opacity-50 mt-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 font-light">
          Remember credentials?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
