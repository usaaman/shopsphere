import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAddress({
          street: data.address?.street || '',
          city: data.address?.city || '',
          postalCode: data.address?.postalCode || '',
          country: data.address?.country || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    try {
      const payload = {
        name,
        email,
        phone,
        address,
      };
      if (password) payload.password = password;

      const { data } = await api.put('/auth/profile', payload);
      updateUser(data);
      setMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Account</span>
      <h1 className="text-3xl font-serif font-bold text-primary mt-1 mb-8">Account Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-[#ECECEC] mb-8 gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition duration-200 ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition duration-200 ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          My Purchases ({orders.length})
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Summary Box */}
          <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl h-fit flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full text-xl font-bold mb-4 font-serif">
              {name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-serif font-bold text-gray-800 text-base">{name}</h2>
            <p className="text-xs text-gray-400 font-light mt-0.5">{email}</p>
            <span className="mt-3.5 inline-block px-3 py-1 bg-ivory rounded-full text-[9px] font-bold text-primary uppercase tracking-widest border border-primary/10">
              {user?.role} Account
            </span>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdateProfile} className="md:col-span-2 flex flex-col gap-6 bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm">
            {message && <p className="bg-green-50 text-green-700 text-xs p-3 rounded-xl font-medium">{message}</p>}
            {error && <p className="bg-red-50 text-[#E24A4A] text-xs p-3 rounded-xl font-medium">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                />
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-[#ECECEC]/60 pt-6">
              <h3 className="font-serif font-bold text-primary text-sm mb-4">Default Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Street address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="border-t border-[#ECECEC]/60 pt-6">
              <h3 className="font-serif font-bold text-primary text-sm mb-4">Update Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
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
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition w-full sm:w-fit self-end mt-2 disabled:opacity-50"
            >
              {updateLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm">
          <h2 className="font-serif font-bold text-primary text-base mb-6">Purchase History</h2>
          {ordersLoading ? (
            <p className="text-gray-500 text-xs font-light">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-500 mb-4 font-light">You have not completed any order transactions yet.</p>
              <Link to="/shop" className="text-primary hover:underline font-bold text-xs uppercase tracking-wider">
                Shop Collections
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-[#ECECEC]/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/15 transition bg-white shadow-sm">
                  <div>
                    <h4 className="font-serif font-bold text-gray-800 text-base">Order #{order._id.slice(-6)}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        order.isPaid ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        order.isDelivered ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-750'
                      }`}>
                        {order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-3.5 sm:pt-0">
                    <span className="font-extrabold text-gray-900 text-base">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                    <Link
                      to={`/orders/${order._id}`}
                      className="bg-primary hover:bg-primary/95 text-white font-semibold px-4 py-2.5 rounded-full text-[10px] uppercase tracking-wider transition shrink-0"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
