import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import api from '../api/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Tab controls
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'products', 'categories', 'orders', 'users'

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Form states (Products)
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // Form states (Categories)
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Fetch admin datasets
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ordRes, usrRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/auth/users'),
      ]);
      setProducts(prodRes.data.products || prodRes.data || []);
      setCategories(catRes.data || []);
      setOrders(ordRes.data || []);
      setUsers(usrRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const triggerMessage = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  // Product CRUD actions
  const handleProductChange = (e) => {
    setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productFormData.image) {
      alert('Please upload an image first');
      return;
    }

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, productFormData);
        triggerMessage('Product updated successfully');
      } else {
        await api.post('/products', productFormData);
        triggerMessage('Product added successfully');
      }
      resetProductForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleProductEdit = (prod) => {
    setProductFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image: prod.image,
      category: prod.category,
      stock: prod.stock,
    });
    setEditingProductId(prod._id);
    setShowProductForm(true);
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        triggerMessage('Product deleted');
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetProductForm = () => {
    setProductFormData({ name: '', description: '', price: '', image: '', category: '', stock: '' });
    setEditingProductId(null);
    setShowProductForm(false);
  };

  // Category CRUD actions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, categoryFormData);
        triggerMessage('Category updated');
      } else {
        await api.post('/categories', categoryFormData);
        triggerMessage('Category added');
      }
      setCategoryFormData({ name: '', description: '' });
      setEditingCategoryId(null);
      setShowCategoryForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Category action failed');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        triggerMessage('Category deleted');
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  // Order actions
  const handleToggleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      triggerMessage('Order delivery status updated');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleTogglePay = async (id) => {
    try {
      await api.put(`/orders/${id}/pay`);
      triggerMessage('Order payment status updated');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  // User actions
  const handleToggleRole = async (usr) => {
    const newRole = usr.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/auth/users/${usr._id}`, { role: newRole });
      triggerMessage('User role updated');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Role toggle failed');
    }
  };

  const handleUserDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        triggerMessage('User deleted');
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-6">
        <h1 className="text-xl font-bold text-error mb-2">Access Denied</h1>
        <p className="text-xs text-gray-500 font-light">Admins only. Contact databases managers for credentials.</p>
      </div>
    );
  }

  // Stats Metrics
  const totalSales = orders.reduce((sum, o) => (o.isPaid ? sum + o.totalPrice : sum), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[#ECECEC]">
        <div>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Operations</span>
          <h1 className="text-3xl font-serif font-bold text-primary mt-1">Admin Panel</h1>
          <p className="text-xs text-gray-500 font-light mt-1">Control inventory parameters, verify dispatches, and check sales charts.</p>
        </div>
        {actionMessage && (
          <span className="bg-primary/5 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
            {actionMessage}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#ECECEC] gap-6 mb-8">
        {['analytics', 'products', 'categories', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition duration-150 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-xs font-light">Loading dashboard variables...</p>
      ) : (
        <AnimatePresence mode="wait">
          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8"
            >
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Revenue', value: `$${totalSales.toFixed(2)}`, bg: 'bg-white border-[#ECECEC] text-primary', icon: '💰' },
                  { label: 'Orders count', value: totalOrders, bg: 'bg-white border-[#ECECEC] text-primary', icon: '📦' },
                  { label: 'Roster accounts', value: totalUsers, bg: 'bg-white border-[#ECECEC] text-primary', icon: '👥' },
                  { label: 'Catalog count', value: totalProducts, bg: 'bg-white border-[#ECECEC] text-primary', icon: '🛒' },
                ].map((card, idx) => (
                  <div key={idx} className={`p-6 rounded-3xl border ${card.bg} flex justify-between items-center shadow-sm`}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{card.label}</p>
                      <h3 className="text-2xl font-black mt-2 text-primary">{card.value}</h3>
                    </div>
                    <span className="text-3xl bg-ivory w-12 h-12 flex items-center justify-center rounded-full shadow-inner">{card.icon}</span>
                  </div>
                ))}
              </div>

              {/* Graphic Chart */}
              <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm">
                <h3 className="font-serif font-bold text-primary text-base mb-6">Sales Chart</h3>
                
                {/* SVG Graph Custom Redesigned */}
                <div className="w-full aspect-[2.5/1] min-h-[220px]">
                  <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth={1} />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth={1} />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="#f3f4f6" strokeWidth={1} />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#ECECEC" strokeWidth={1.5} />

                    <path
                      d="M 40 170 Q 150 140, 260 70 T 480 30"
                      fill="none"
                      stroke="#264E3B"
                      strokeWidth={3}
                      strokeLinecap="round"
                    />

                    <circle cx="40" cy="170" r="5" fill="#264E3B" />
                    <circle cx="150" cy="140" r="5" fill="#264E3B" />
                    <circle cx="260" cy="70" r="5" fill="#264E3B" />
                    <circle cx="480" cy="30" r="5" fill="#264E3B" />

                    <text x="40" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q1</text>
                    <text x="150" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q2</text>
                    <text x="260" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q3</text>
                    <text x="480" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q4</text>
                    
                    <text x="30" y="24" fontSize="9" fill="#9ca3af" textAnchor="end" fontWeight="bold">Max</text>
                    <text x="30" y="174" fontSize="9" fill="#9ca3af" textAnchor="end" fontWeight="bold">0</text>
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-primary text-base">Catalog Listing</h3>
                {!showProductForm && (
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-primary/95 uppercase tracking-wider"
                  >
                    + Add Product
                  </button>
                )}
              </div>

              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#ECECEC] p-6 rounded-3xl bg-white shadow-sm">
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productFormData.name}
                    onChange={handleProductChange}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-ivory focus:bg-white"
                    required
                  />
                  <select
                    name="category"
                    value={productFormData.category}
                    onChange={handleProductChange}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-ivory focus:bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productFormData.price}
                    onChange={handleProductChange}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-ivory focus:bg-white"
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock quantity"
                    value={productFormData.stock}
                    onChange={handleProductChange}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-ivory focus:bg-white"
                    required
                  />
                  
                  {/* Upload */}
                  <ImageUpload value={productFormData.image} onUploaded={(url) => setProductFormData({ ...productFormData, image: url })} />

                  <textarea
                    name="description"
                    placeholder="Description specification fields..."
                    value={productFormData.description}
                    onChange={handleProductChange}
                    rows={3}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs sm:col-span-2 resize-none bg-ivory focus:bg-white"
                    required
                  />

                  <div className="sm:col-span-2 flex gap-3 mt-2">
                    <button type="submit" className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-full">
                      {editingProductId ? 'Update' : 'Save'}
                    </button>
                    <button type="button" onClick={resetProductForm} className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-full">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Grid List */}
              <div className="flex flex-col border border-[#ECECEC] rounded-3xl overflow-hidden divide-y divide-[#ECECEC] bg-white shadow-sm">
                {products.map((p) => (
                  <div key={p._id} className="p-4 flex items-center justify-between gap-4 hover:bg-ivory/30">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100" />
                      <div>
                        <h4 className="font-serif font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          Category: {p.category} &bull; Price: ${p.price} &bull; Stock: {p.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 pr-2">
                      <button onClick={() => handleProductEdit(p)} className="text-xs font-semibold text-blue-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleProductDelete(p._id)} className="text-xs font-semibold text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-primary text-base">Collections</h3>
                {!showCategoryForm && (
                  <button
                    onClick={() => {
                      setCategoryFormData({ name: '', description: '' });
                      setEditingCategoryId(null);
                      setShowCategoryForm(true);
                    }}
                    className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-primary/95 uppercase tracking-wider"
                  >
                    + Add Category
                  </button>
                )}
              </div>

              {showCategoryForm && (
                <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4 border border-[#ECECEC] p-6 rounded-3xl bg-white shadow-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Living Room Decor"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-ivory focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea
                      placeholder="Describe category parameters..."
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      rows={2}
                      className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs resize-none bg-ivory focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full">
                      {editingCategoryId ? 'Update' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* List */}
              <div className="flex flex-col border border-[#ECECEC] rounded-3xl overflow-hidden divide-y divide-[#ECECEC] bg-white shadow-sm">
                {categories.length === 0 ? (
                  <p className="text-gray-400 text-xs font-light p-4">No categories created yet.</p>
                ) : (
                  categories.map((c) => (
                    <div key={c._id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-serif font-bold text-gray-800 text-sm">{c.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-light">{c.description || 'No description provided'}</p>
                      </div>
                      <div className="flex gap-4 pr-2">
                        <button
                          onClick={() => {
                            setCategoryFormData({ name: c.name, description: c.description || '' });
                            setEditingCategoryId(c._id);
                            setShowCategoryForm(true);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleCategoryDelete(c._id)} className="text-xs font-semibold text-red-500 hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <h3 className="font-serif font-bold text-primary text-base">Receipts List</h3>
              
              <div className="flex flex-col border border-[#ECECEC] rounded-3xl overflow-hidden divide-y divide-[#ECECEC] bg-white shadow-sm">
                {orders.length === 0 ? (
                  <p className="text-gray-400 text-xs font-light p-4">No orders placed on platform.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o._id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-ivory/10">
                      <div>
                        <h4 className="font-serif font-bold text-gray-800 text-sm">Order #{o._id.slice(-6)} &bull; Total: ${o.totalPrice}</h4>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                          Buyer: {o.user?.name} ({o.user?.email}) &bull; Method: {o.paymentMethod}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            o.isPaid ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
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
                      <div className="flex gap-2">
                        {!o.isPaid && (
                          <button
                            onClick={() => handleTogglePay(o._id)}
                            className="bg-success text-white font-bold px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition hover:bg-success/90"
                          >
                            Mark Paid
                          </button>
                        )}
                        {!o.isDelivered && (
                          <button
                            onClick={() => handleToggleDeliver(o._id)}
                            className="bg-primary text-white font-bold px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition hover:bg-primary/95"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              <h3 className="font-serif font-bold text-primary text-base">User Accounts</h3>

              <div className="flex flex-col border border-[#ECECEC] rounded-3xl overflow-hidden divide-y divide-[#ECECEC] bg-white shadow-sm">
                {users.map((u) => (
                  <div key={u._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif font-bold text-gray-800 text-sm">{u.name}</h4>
                      <p className="text-xs text-gray-500 font-light mt-0.5">{u.email}</p>
                      <span className="mt-2 inline-block text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 bg-ivory rounded-full text-primary border border-primary/10">
                        {u.role}
                      </span>
                    </div>
                    <div className="flex gap-4 pr-2">
                      <button onClick={() => handleToggleRole(u)} className="text-xs font-semibold text-blue-600 hover:underline">
                        Toggle Role
                      </button>
                      <button onClick={() => handleUserDelete(u._id)} className="text-xs font-semibold text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminDashboard;