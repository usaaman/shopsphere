import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const Wishlist = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      updateUser({ wishlist: data.wishlist });
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-6">
        <h1 className="text-xl font-serif font-bold text-primary mb-2">Access Denied</h1>
        <p className="text-xs text-gray-500 mb-6 font-light">Please login to view your personal wishlist items.</p>
        <Link to="/login" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary/95">
          Login Account
        </Link>
      </div>
    );
  }

  const wishlistItems = user.wishlist || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Favorites</span>
      <h1 className="text-3xl font-serif font-bold text-primary mt-1 mb-2 tracking-tight">My Wishlist</h1>
      <p className="text-xs text-gray-500 mb-10 font-light">
        Your favorite products saved for later. Easily migrate items to your shopping cart.
      </p>

      {loading ? (
        <p className="text-gray-500 text-xs font-light">Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
          <span className="text-4xl">❤️</span>
          <h2 className="font-serif font-bold text-primary mt-4 mb-2">Your wishlist is empty</h2>
          <p className="text-xs text-gray-500 mb-6 font-light leading-relaxed">
            Tap the heart icon on any product card while browsing to save it to your wishlist.
          </p>
          <Link to="/shop" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary/95">
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((product) => {
              if (product && typeof product === 'object') {
                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
