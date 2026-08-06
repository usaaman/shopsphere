import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = user && user.wishlist ? user.wishlist.length : 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#ECECEC] py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo - Serif Editorial style */}
        <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tight shrink-0">
          verdora
        </Link>

        {/* Search Bar - Minimal Rounded */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-grow max-w-sm relative">
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-[#FAF8F4]/80 text-xs border border-[#ECECEC] rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-primary focus:bg-white transition-colors duration-150"
          />
          <button type="submit" className="absolute right-3 text-gray-400 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </button>
        </form>

        {/* Desktop Links & Actions */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop" className="text-xs font-semibold tracking-wider uppercase text-gray-600 hover:text-primary transition-colors">
            Shop All
          </Link>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative p-1 text-gray-600 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5.5 h-5.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-1 text-gray-600 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5.5 h-5.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5h6.75M8.625 12.75h6.75" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Access */}
          {user ? (
            <div className="flex items-center gap-5">
              <Link to="/profile" className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-primary transition-colors">
                Hi, {user.name.split(' ')[0]}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 hover:bg-primary/15 text-primary px-3 py-1.5 rounded-full transition">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold uppercase tracking-widest text-[#E24A4A] hover:bg-red-50 px-3 py-1.5 rounded-full transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-primary px-3 py-2 rounded-full transition">
                Login
              </Link>
              <Link to="/register" className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-sm transition">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-gray-600 hover:text-primary focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile menu container */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ECECEC] mt-3 pt-4 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-[#FAF8F4] text-xs border border-[#ECECEC] rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:border-primary"
            />
            <button type="submit" className="absolute right-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </button>
          </form>

          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-primary py-1">
            Shop All
          </Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-primary py-1 flex items-center justify-between">
            Wishlist {wishlistCount > 0 && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-primary py-1 flex items-center justify-between">
            Cart {cartCount > 0 && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="border-t border-[#ECECEC] pt-3 flex flex-col gap-3">
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase text-gray-700">
                Hi, {user.name}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase text-primary">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left bg-red-50 text-[#E24A4A] text-xs font-bold py-2.5 px-4 rounded-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-[#ECECEC] pt-3 flex gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center text-xs font-bold uppercase tracking-wider text-gray-700 py-3 border border-[#ECECEC] rounded-full">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center text-xs font-bold uppercase tracking-wider text-white bg-primary py-3 rounded-full">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;