import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Hide Right Sidebar on administrative or authentication routes for spacious viewforms
  const hideRightSidebar = [
    '/login',
    '/register',
    '/forgot-password',
    '/checkout',
    '/admin'
  ].includes(location.pathname);

  // Hide left sidebar on admin dashboard to allow its own navigation layout
  const hideLeftSidebar = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* 1. LEFT SIDEBAR (Sticky Menu) */}
      {!hideLeftSidebar && (
        <SidebarLeft isOpen={leftSidebarOpen} onClose={() => setLeftSidebarOpen(false)} />
      )}

      {/* 2. CENTER CONTENT COLUMN */}
      <div className="flex-grow flex flex-col min-w-0 bg-bg-soft">
        {/* Top Search bar Header */}
        <Navbar
          onToggleLeft={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRight={() => setRightSidebarOpen(!rightSidebarOpen)}
        />

        <main className="flex-grow p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />

            {/* Protected Routes (Guests Redirected to Login) */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
            </Route>

            {/* Admin Routes (Non-admins Redirected to Home) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global bottom trust pillars bar */}
        <Footer />
      </div>

      {/* 3. RIGHT SIDEBAR (Cart Details) */}
      {!hideRightSidebar && (
        <SidebarRight isOpen={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)} />
      )}
    </div>
  );
}

export default App;