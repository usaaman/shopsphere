import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import ImageUpload from '../components/ImageUpload';
import api from '../api/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  // Tab controls
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'products', 'categories', 'orders', 'users', 'coupons'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Layout preference
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' or 'grid'
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Bulk Selection
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Form states (Products)
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    featured: false,
    bestSeller: false,
    newArrival: false,
    trending: false,
    flashSale: false,
    homePriority: 0,
    badge: '',
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
      showToast('Error loading database assets', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Product CRUD actions
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productFormData.image) {
      showToast('Please upload a product photo first', 'danger');
      return;
    }

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, productFormData);
        showToast('Product updated successfully');
      } else {
        await api.post('/products', productFormData);
        showToast('Product added successfully');
      }
      resetProductForm();
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'danger');
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
      featured: prod.featured || false,
      bestSeller: prod.bestSeller || false,
      newArrival: prod.newArrival || false,
      trending: prod.trending || false,
      flashSale: prod.flashSale || false,
      homePriority: prod.homePriority || 0,
      badge: prod.badge || '',
    });
    setEditingProductId(prod._id);
    setShowProductForm(true);
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        showToast('Product deleted successfully');
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Delete failed', 'danger');
      }
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: '',
      featured: false,
      bestSeller: false,
      newArrival: false,
      trending: false,
      flashSale: false,
      homePriority: 0,
      badge: '',
    });
    setEditingProductId(null);
    setShowProductForm(false);
  };

  // Quick Inline Priority Updates
  const handleTogglePriority = async (prod, fieldName) => {
    try {
      const updatedValue = !prod[fieldName];
      await api.put(`/products/${prod._id}`, {
        ...prod,
        [fieldName]: updatedValue,
      });
      showToast(`Updated "${prod.name}" priority: ${fieldName} is now ${updatedValue}`);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update priority', 'danger');
    }
  };

  // Bulk deletion
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (window.confirm(`Delete ${selectedProductIds.length} selected items?`)) {
      try {
        await Promise.all(selectedProductIds.map((id) => api.delete(`/products/${id}`)));
        showToast(`Bulk deleted ${selectedProductIds.length} products`);
        setSelectedProductIds([]);
        fetchData();
      } catch (err) {
        showToast('Bulk deletion failure', 'danger');
      }
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAllProducts = (filtered) => {
    if (selectedProductIds.length === filtered.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filtered.map((p) => p._id));
    }
  };

  // Category Actions
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, categoryFormData);
        showToast('Category updated successfully');
      } else {
        await api.post('/categories', categoryFormData);
        showToast('Category added successfully');
      }
      setCategoryFormData({ name: '', description: '' });
      setEditingCategoryId(null);
      setShowCategoryForm(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Category action failed', 'danger');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        showToast('Category deleted successfully');
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.message || 'Delete failed', 'danger');
      }
    }
  };

  // Deliveries & Payments
  const handleToggleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      showToast('Order delivery updated');
      fetchData();
    } catch (err) {
      showToast('Delivery update failed', 'danger');
    }
  };

  const handleTogglePay = async (id) => {
    try {
      await api.put(`/orders/${id}/pay`);
      showToast('Order payment updated');
      fetchData();
    } catch (err) {
      showToast('Payment update failed', 'danger');
    }
  };

  // User Administration
  const handleToggleRole = async (usr) => {
    const newRole = usr.role === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/auth/users/${usr._id}`, { role: newRole });
      showToast(`Updated user role to ${newRole}`);
      fetchData();
    } catch (err) {
      showToast('Role update failed', 'danger');
    }
  };

  const handleUserDelete = async (id) => {
    if (window.confirm('Delete user profile?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        showToast('User profile deleted');
        fetchData();
      } catch (err) {
        showToast('Delete failed', 'danger');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-6">
        <h1 className="text-xl font-bold text-danger mb-2">Access Denied</h1>
        <p className="text-xs text-text-secondary font-light">Admins credentials required. Access restricted.</p>
      </div>
    );
  }

  // Analytics Metrics
  const totalSales = orders.reduce((sum, o) => (o.isPaid ? sum + o.totalPrice : sum), 0);
  const pendingSales = orders.reduce((sum, o) => (!o.isPaid ? sum + o.totalPrice : sum), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside className={`border-r border-border-light bg-white flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-60'
        } p-4 shrink-0 hidden md:flex`}>
        <div className="flex justify-between items-center pb-4 border-b border-border-light mb-6">
          {!sidebarCollapsed && <span className="text-sm font-extrabold text-text-primary tracking-tight">shopsphere admin</span>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded bg-bg-soft hover:bg-gray-150 text-text-secondary ml-auto text-xs"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {[
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'products', label: 'Products', icon: '🛍️' },
            { id: 'categories', label: 'Categories', icon: '📂' },
            { id: 'orders', label: 'Orders Logs', icon: '🧾' },
            { id: 'users', label: 'User Roster', icon: '👥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-sm'
                  : 'text-text-secondary hover:bg-bg-soft hover:text-text-primary'
                }`}
            >
              <span>{tab.icon}</span>
              {!sidebarCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* 2. MAIN SECTION */}
      <div className="flex-grow flex flex-col p-6 min-w-0">

        {/* Mobile Header Tabs */}
        <div className="flex md:hidden flex-wrap border-b border-border-light gap-4 mb-6">
          {['analytics', 'products', 'categories', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[10px] font-bold uppercase tracking-wider border-b-2 ${activeTab === tab ? 'border-primary-start text-primary-start' : 'border-transparent text-text-secondary'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-text-secondary text-xs font-light">Syncing database assets...</p>
        ) : (
          <AnimatePresence mode="wait">

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8 animate-fade-in"
              >
                {/* KPI Growth Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `$${totalSales.toFixed(2)}`, desc: 'Paid invoices summary', icon: '💵' },
                    { label: 'Pending Sales', value: `$${pendingSales.toFixed(2)}`, desc: 'Unpaid order logs', icon: '⌛' },
                    { label: 'Deliveries count', value: totalOrders, desc: 'Processed receipts logs', icon: '📦' },
                    { label: 'User Roster', value: totalUsers, desc: 'Registered accounts count', icon: '👥' },
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white border border-border-light p-6 rounded-2xl flex justify-between items-center shadow-sm">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">{card.label}</span>
                        <h3 className="text-2xl font-black text-text-primary mt-2">{card.value}</h3>
                        <span className="text-[9px] text-text-secondary block mt-1.5 font-light">{card.desc}</span>
                      </div>
                      <span className="text-3xl bg-bg-soft w-12 h-12 flex items-center justify-center rounded-xl">{card.icon}</span>
                    </div>
                  ))}
                </div>

                {/* SVG line chart */}
                <div className="bg-white border border-border-light p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-text-primary text-xs mb-6 uppercase tracking-wider">Revenue Progression Graph</h3>
                  <div className="w-full aspect-[2.5/1] min-h-[220px]">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth={1} />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#f3f4f6" strokeWidth={1} />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#f3f4f6" strokeWidth={1} />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="#ECECEC" strokeWidth={1.5} />

                      <path
                        d="M 40 170 Q 150 140, 260 70 T 480 30"
                        fill="none"
                        stroke="#7C5CFF"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                      />

                      <circle cx="40" cy="170" r="5" fill="#7C5CFF" />
                      <circle cx="150" cy="140" r="5" fill="#7C5CFF" />
                      <circle cx="260" cy="70" r="5" fill="#7C5CFF" />
                      <circle cx="480" cy="30" r="5" fill="#7C5CFF" />

                      <text x="40" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q1</text>
                      <text x="150" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q2</text>
                      <text x="260" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q3</text>
                      <text x="480" y="190" fontSize="9" fill="#9ca3af" textAnchor="middle" fontWeight="bold">Q4</text>
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
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border-light pb-4">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Inventory Catalog</h3>
                    <p className="text-xs text-text-secondary font-light mt-0.5">Toggle home page features & edit items</p>
                  </div>
                  {!showProductForm && (
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:opacity-95 uppercase tracking-wider shadow-sm"
                    >
                      + Add Product
                    </button>
                  )}
                </div>

                {showProductForm && (
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border-light p-6 rounded-2xl bg-white shadow-sm">
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Title"
                      value={productFormData.name}
                      onChange={handleProductChange}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white animate-fade-in"
                      required
                    />
                    <select
                      name="category"
                      value={productFormData.category}
                      onChange={handleProductChange}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
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
                      placeholder="Price ($)"
                      value={productFormData.price}
                      onChange={handleProductChange}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                      required
                    />
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock quantity"
                      value={productFormData.stock}
                      onChange={handleProductChange}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                      required
                    />

                    {/* Custom Image Upload */}
                    <ImageUpload value={productFormData.image} onUploaded={(url) => setProductFormData({ ...productFormData, image: url })} />

                    <textarea
                      name="description"
                      placeholder="Describe specifications details..."
                      value={productFormData.description}
                      onChange={handleProductChange}
                      rows={3}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs sm:col-span-2 resize-none bg-bg-soft/75 focus:bg-white"
                      required
                    />

                    {/* Priority Control Switches */}
                    <div className="sm:col-span-2 border-t border-border-light pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { name: 'featured', label: 'Featured' },
                        { name: 'bestSeller', label: 'Best Seller' },
                        { name: 'newArrival', label: 'New Arrival' },
                        { name: 'trending', label: 'Trending' },
                        { name: 'flashSale', label: 'Flash Sale' },
                      ].map((pr) => (
                        <label key={pr.name} className="flex items-center gap-2 text-xs font-semibold text-text-primary cursor-pointer select-none">
                          <input
                            type="checkbox"
                            name={pr.name}
                            checked={productFormData[pr.name]}
                            onChange={handleProductChange}
                            className="accent-primary-start w-4 h-4 rounded"
                          />
                          <span>{pr.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="sm:col-span-2 flex gap-3 mt-4">
                      <button type="submit" className="bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-sm">
                        {editingProductId ? 'Update' : 'Save'}
                      </button>
                      <button type="button" onClick={resetProductForm} className="bg-gray-100 hover:bg-gray-250 text-text-secondary font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Grid vs Table Layout selection filters */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search name/category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-white border border-border-light rounded-full py-2 px-4 text-xs focus:outline-none"
                    />
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="bg-white border border-border-light rounded-full py-2 px-4 text-xs text-text-secondary font-bold focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    {selectedProductIds.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-50 text-danger text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-danger/10"
                      >
                        Delete Selected ({selectedProductIds.length})
                      </button>
                    )}
                    <div className="flex border border-border-light rounded-full bg-white overflow-hidden">
                      <button
                        onClick={() => setProductViewMode('table')}
                        className={`px-4.5 py-2 text-xs font-bold ${productViewMode === 'table' ? 'bg-bg-soft text-primary-start' : 'text-text-secondary'
                          }`}
                      >
                        Table
                      </button>
                      <button
                        onClick={() => setProductViewMode('grid')}
                        className={`px-4.5 py-2 text-xs font-bold ${productViewMode === 'grid' ? 'bg-bg-soft text-primary-start' : 'text-text-secondary'
                          }`}
                      >
                        Priority Matrix
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table View */}
                {productViewMode === 'table' && (
                  <div className="bg-white border border-border-light rounded-2xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs leading-normal">
                      <thead>
                        <tr className="bg-bg-soft border-b border-border-light text-[10px] text-text-secondary font-bold uppercase tracking-wider select-none">
                          <th className="p-4 w-10">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={() => toggleSelectAllProducts(filteredProducts)}
                              className="accent-primary-start w-3.5 h-3.5"
                            />
                          </th>
                          <th className="p-4">Item details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Pricing</th>
                          <th className="p-4">Stock status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light/60 font-light text-text-secondary">
                        {filteredProducts.map((p) => (
                          <tr key={p._id} className="hover:bg-bg-soft/40">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(p._id)}
                                onChange={() => toggleSelectProduct(p._id)}
                                className="accent-primary-start w-3.5 h-3.5"
                              />
                            </td>
                            <td className="p-4 flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-border-light/35" />
                              <span className="font-semibold text-text-primary text-xs line-clamp-1">{p.name}</span>
                            </td>
                            <td className="p-4">{p.category}</td>
                            <td className="p-4 font-bold text-text-primary">${p.price.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${p.stock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                }`}>
                                {p.stock > 0 ? `In Stock (${p.stock})` : 'Sold Out'}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-3.5 mt-2">
                              <button onClick={() => handleProductEdit(p)} className="text-blue-600 font-bold hover:underline">Edit</button>
                              <button onClick={() => handleProductDelete(p._id)} className="text-danger font-bold hover:underline">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Priority Matrix Grid */}
                {productViewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <div key={p._id} className="bg-white border border-border-light rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                        <div className="flex gap-3">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-border-light/35" />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-text-primary text-xs truncate">{p.name}</h4>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">${p.price}</p>
                          </div>
                        </div>

                        {/* Direct Switches */}
                        <div className="border-t border-border-light/60 pt-4 flex flex-col gap-2">
                          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Priority Controls</span>
                          {[
                            { key: 'featured', label: 'Featured Selection' },
                            { key: 'bestSeller', label: 'Best Seller tag' },
                            { key: 'newArrival', label: 'New Arrival indicator' },
                            { key: 'trending', label: 'Trending list' },
                            { key: 'flashSale', label: 'Flash Sale tag' },
                          ].map((item) => (
                            <label key={item.key} className="flex justify-between items-center text-xs font-light text-text-secondary cursor-pointer">
                              <span>{item.label}</span>
                              <input
                                type="checkbox"
                                checked={p[item.key] || false}
                                onChange={() => handleTogglePriority(p, item.key)}
                                className="accent-primary-start w-3.5 h-3.5"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="flex justify-between items-center border-b border-border-light pb-4">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Collections CRUD</h3>
                    <p className="text-xs text-text-secondary font-light mt-0.5">Manage shop category lists</p>
                  </div>
                  {!showCategoryForm && (
                    <button
                      onClick={() => {
                        setCategoryFormData({ name: '', description: '' });
                        setEditingCategoryId(null);
                        setShowCategoryForm(true);
                      }}
                      className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:opacity-95 uppercase tracking-wider shadow-sm"
                    >
                      + Add Category
                    </button>
                  )}
                </div>

                {showCategoryForm && (
                  <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4 border border-border-light p-6 rounded-2xl bg-white shadow-sm">
                    <input
                      type="text"
                      placeholder="Category Title"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white animate-fade-in"
                      required
                    />
                    <textarea
                      placeholder="Collection descriptions parameters..."
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      rows={2}
                      className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs resize-none bg-bg-soft/75 focus:bg-white"
                    />
                    <div className="flex gap-3">
                      <button type="submit" className="bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-sm">
                        {editingCategoryId ? 'Update' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-gray-100 hover:bg-gray-250 text-text-secondary font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Collections List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((c) => (
                    <div key={c._id} className="bg-white border border-border-light p-5 rounded-2xl shadow-sm flex flex-col gap-3 justify-between hover:shadow-md transition">
                      <div>
                        <span className="text-xl">📁</span>
                        <h4 className="font-bold text-text-primary text-xs mt-3">{c.name}</h4>
                        <p className="text-xs text-text-secondary mt-1.5 font-light leading-relaxed line-clamp-2">{c.description || 'No description coordinates defined.'}</p>
                      </div>
                      <div className="flex gap-4 border-t border-border-light/60 pt-3 mt-3">
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
                        <button onClick={() => handleCategoryDelete(c._id)} className="text-xs font-semibold text-danger hover:underline">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
                <div className="border-b border-border-light pb-4">
                  <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Order Management Logs</h3>
                  <p className="text-xs text-text-secondary font-light mt-0.5">Approve payments and coordinate dispatch updates</p>
                </div>

                <div className="flex flex-col border border-border-light rounded-2xl overflow-hidden divide-y divide-border-light bg-white shadow-sm">
                  {orders.map((o) => (
                    <div key={o._id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-bg-soft/30 transition">
                      <div>
                        <h4 className="font-bold text-text-primary text-xs">Order #{o._id.slice(-6)} &bull; Price: ${o.totalPrice.toFixed(2)}</h4>
                        <p className="text-[10px] text-text-secondary mt-1 font-semibold">
                          Buyer: {o.user?.name} ({o.user?.email}) &bull; Date: {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2.5 mt-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${o.isPaid ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                            }`}>
                            {o.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${o.isDelivered ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-750'
                            }`}>
                            {o.isDelivered ? 'Delivered' : 'Pending Dispatch'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!o.isPaid && (
                          <button
                            onClick={() => handleTogglePay(o._id)}
                            className="bg-success text-white font-bold px-4 py-2 rounded-full text-[9px] uppercase tracking-widest transition hover:opacity-90"
                          >
                            Mark Paid
                          </button>
                        )}
                        {!o.isDelivered && (
                          <button
                            onClick={() => handleToggleDeliver(o._id)}
                            className="bg-gradient-to-r from-primary-start to-primary-end text-white font-bold px-4 py-2 rounded-full text-[9px] uppercase tracking-widest transition hover:opacity-95"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
                <div className="border-b border-border-light pb-4">
                  <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">User Account Roster</h3>
                  <p className="text-xs text-text-secondary font-light mt-0.5">Toggle admin access levels or delete profiles</p>
                </div>

                <div className="flex flex-col border border-border-light rounded-2xl overflow-hidden divide-y divide-border-light bg-white shadow-sm">
                  {users.map((u) => (
                    <div key={u._id} className="p-4.5 flex items-center justify-between gap-4 hover:bg-bg-soft/30 transition">
                      <div>
                        <h4 className="font-bold text-text-primary text-xs">{u.name}</h4>
                        <p className="text-xs text-text-secondary font-light mt-0.5">{u.email}</p>
                        <span className={`mt-2 inline-block text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-primary-start/10 text-primary-start' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="flex gap-4 pr-2">
                        <button onClick={() => handleToggleRole(u)} className="text-xs font-semibold text-blue-600 hover:underline">
                          Toggle Role
                        </button>
                        <button onClick={() => handleUserDelete(u._id)} className="text-xs font-semibold text-danger hover:underline">
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
    </div>
  );
};

export default AdminDashboard;