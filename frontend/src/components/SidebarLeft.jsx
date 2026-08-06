import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SidebarLeft = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const links = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Categories', path: '/shop', icon: '📁' },
    { label: 'Wishlist', path: '/wishlist', icon: '❤️' },
    { label: 'My Orders', path: '/orders', icon: '📦' },
    { label: 'Account Settings', path: '/profile', icon: '⚙️' },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-border-light p-5 flex flex-col gap-6 transform lg:transform-none lg:sticky transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-0.5'
        } lg:translate-x-0`}
    >
      {/* Mobile close button */}
      <button onClick={onClose} className="lg:hidden absolute top-4 right-4 text-text-secondary hover:text-text-primary text-sm font-bold">
        ✕
      </button>

      {/* Header Logo */}
      <div className="flex items-center justify-between pb-4 border-b border-border-light">
        <Link to="/" className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-start to-primary-end shadow-sm" />
          <span>shopsphere</span>
        </Link>
      </div>

      {/* Main Navigation links */}
      <div className="flex flex-col gap-1.5 flex-grow">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest pl-3 mb-2">Main Menu</span>
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive(link.path)
                ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-sm'
                : 'text-text-secondary hover:bg-bg-soft hover:text-text-primary'
              }`}
          >
            <span className="text-sm">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}

        {user && user.role === 'admin' && (
          <Link
            to="/admin"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold mt-4 border border-primary-start/25 text-primary-start hover:bg-primary-start/5`}
          >
            <span className="text-sm">🔑</span>
            <span>Admin Control</span>
          </Link>
        )}
      </div>

      {/* bottom Promo Offer Card */}
      <div className="bg-gradient-to-br from-primary-start to-primary-end rounded-2xl p-4 text-white relative overflow-hidden shadow-sm">
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full" />
        <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">Special Offer</span>
        <h4 className="font-bold text-sm mt-2 leading-tight">Summer Sale<br />Up to 50% Off</h4>
        <Link
          to="/shop"
          onClick={onClose}
          className="mt-3.5 inline-block text-[10px] font-bold bg-white text-primary-start px-4 py-2 rounded-xl text-center tracking-wider uppercase shadow-sm"
        >
          Shop Now
        </Link>
      </div>

      {/* Support Line */}
      <div className="text-[10px] text-text-secondary leading-relaxed font-light mt-auto">
        <p className="font-bold text-text-primary">Need Help?</p>
        <p>24/7 Support: support@shopsphere.com</p>
      </div>
    </aside>
  );
};

export default SidebarLeft;
