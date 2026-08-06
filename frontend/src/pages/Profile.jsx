import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
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
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'payments', 'orders'

  // Mock payment methods
  const [paymentMethods] = useState([
    { id: '1', type: 'Visa', last4: '4242', exp: '12/28', name: 'Jane Doe' },
    { id: '2', type: 'Mastercard', last4: '8888', exp: '09/27', name: 'Jane Doe' },
  ]);

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
    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'danger');
      return;
    }

    setUpdateLoading(true);
    try {
      const payload = { name, email, phone, address };
      if (password) payload.password = password;

      const { data } = await api.put('/auth/profile', payload);
      updateUser(data);
      showToast('Settings saved successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'danger');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
      
      {/* 1. SIDE NAVIGATION LINKS */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center bg-white p-5 border border-border-light rounded-2xl shadow-sm">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-start/15 to-primary-end/15 text-primary-start flex items-center justify-center rounded-full text-lg font-bold mb-3 shadow-sm select-none">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-semibold text-text-primary text-sm">{name}</h2>
          <span className="mt-2.5 inline-block px-3 py-1 bg-bg-soft rounded-full text-[9px] font-bold text-primary-start uppercase tracking-widest border border-border-light shadow-sm">
            {user?.role} Account
          </span>
        </div>

        <div className="flex flex-col gap-1.5 bg-white border border-border-light p-3 rounded-2xl shadow-sm">
          {[
            { id: 'profile', label: 'Personal Info', icon: '👤' },
            { id: 'addresses', label: 'Addresses', icon: '🏡' },
            { id: 'payments', label: 'Payment Options', icon: '💳' },
            { id: 'orders', label: 'Orders List', icon: '📦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'text-text-secondary hover:bg-bg-soft hover:text-text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB DETAILS SHEET */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleUpdateProfile}
              className="bg-white border border-border-light p-6 rounded-2xl shadow-sm flex flex-col gap-5"
            >
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider pb-2 border-b border-border-light">Personal Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password update options */}
              <div className="border-t border-border-light pt-5 mt-2 flex flex-col gap-4">
                <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Update Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest py-3 px-6 rounded-full transition self-end disabled:opacity-50 mt-2 shadow-sm"
              >
                {updateLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </motion.form>
          )}

          {activeTab === 'addresses' && (
            <motion.form
              key="addresses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleUpdateProfile}
              className="bg-white border border-border-light p-6 rounded-2xl shadow-sm flex flex-col gap-5"
            >
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider pb-2 border-b border-border-light">Default Address</h3>
              
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Country</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3 text-xs bg-bg-soft/50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest py-3 px-6 rounded-full transition self-end disabled:opacity-50 mt-2 shadow-sm"
              >
                {updateLoading ? 'Saving...' : 'Save Address'}
              </button>
            </motion.form>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-border-light p-6 rounded-2xl shadow-sm flex flex-col gap-5"
            >
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider pb-2 border-b border-border-light">Saved Payment Methods</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="border border-border-light p-4 rounded-xl flex flex-col justify-between aspect-[1.6/1] bg-gradient-to-br from-white to-bg-soft relative shadow-sm overflow-hidden select-none">
                    <div className="absolute right-4 top-4 text-xs font-bold uppercase text-text-secondary/40">{pm.type}</div>
                    <div className="text-[10px] font-bold text-text-secondary tracking-[0.2em] mt-4">•••• •••• •••• {pm.last4}</div>
                    <div className="flex justify-between items-end mt-auto text-[9px] font-bold uppercase text-text-secondary">
                      <div>
                        <span className="block text-[8px] font-medium text-text-secondary/50">Holder</span>
                        <span>{pm.name}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-medium text-text-secondary/50">Expiry</span>
                        <span>{pm.exp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-border-light p-6 rounded-2xl shadow-sm flex flex-col gap-5"
            >
              <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider pb-2 border-b border-border-light">Purchases List</h3>
              
              {ordersLoading ? (
                <p className="text-xs text-text-secondary font-light">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-text-secondary mb-4 font-light">No order records registered.</p>
                  <Link to="/shop" className="text-primary-start hover:underline font-bold text-xs uppercase tracking-wider">
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((o) => (
                    <div key={o._id} className="border border-border-light rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-bg-soft/40 transition">
                      <div>
                        <h4 className="font-bold text-text-primary text-xs">Order #{o._id.slice(-6)} &bull; Price: ${o.totalPrice.toFixed(2)}</h4>
                        <span className="text-[10px] text-text-secondary block mt-0.5">Placed: {new Date(o.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            o.isPaid ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                          }`}>
                            {o.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            o.isDelivered ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-750'
                          }`}>
                            {o.isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <Link to={`/orders/${o._id}`} className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs px-4 py-2 rounded-full text-center shadow-sm">
                        Track Order
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
