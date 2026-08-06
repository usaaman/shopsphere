import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = ({ onToggleLeft, onToggleRight }) => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

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
    <nav className="bg-white border-b border-border-light py-3 px-6 shadow-sm flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Mobile left menu trigger */}
      <button
        onClick={onToggleLeft}
        className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5.5 h-5.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Wide Rounded Search Box */}
      <form onSubmit={handleSearchSubmit} className="flex-grow max-w-lg relative flex items-center">
        <input
          type="text"
          placeholder="Search for products, brands and more..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-bg-soft border border-border-light rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-primary-start focus:bg-white transition-all duration-150"
        />
        <button type="submit" className="absolute right-3 text-text-secondary hover:text-primary-start">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
          </svg>
        </button>
      </form>

      {/* Right Icons: Wishlist, Notification, Profile */}
      <div className="flex items-center gap-4.5">
        {/* Wishlist Link */}
        <Link to="/wishlist" className="relative p-1.5 text-text-secondary hover:text-text-primary transition-colors hidden sm:block" title="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-0 bg-accent text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Mock Notification Bell */}
        <div className="relative p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5.5 h-5.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-0 right-0 bg-danger text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Mobile right menu trigger (bag/cart drawer) */}
        <button
          onClick={onToggleRight}
          className="lg:hidden relative p-1.5 text-text-secondary hover:text-text-primary focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5.5 h-5.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5h6.75M8.625 12.75h6.75" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary-start text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        {/* User profile dropdown avatar */}
        {user ? (
          <div className="flex items-center gap-3 border-l border-border-light pl-4.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-start/15 to-primary-end/15 text-primary-start flex items-center justify-center font-bold text-xs shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-text-primary hidden md:inline">{user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-wider text-danger hover:underline hidden md:inline">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-l border-border-light pl-4.5">
            <Link to="/login" className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full transition">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;