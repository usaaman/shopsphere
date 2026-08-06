import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <h1 className="text-2xl font-serif font-bold text-primary mb-2">Create Account</h1>
        <p className="text-xs text-gray-500 mb-6 font-light">Register to start managing your wishlists and personal tracking.</p>

        {error && <p className="bg-red-50 text-[#E24A4A] text-xs p-3 rounded-xl mb-4 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
              required
            />
          </div>

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
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest p-3.5 rounded-full transition duration-150 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6 font-light">
          Already registered?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;