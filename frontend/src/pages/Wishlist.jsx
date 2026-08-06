import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';

const Wishlist = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleRemove = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/auth/wishlist/${id}`);
      updateUser({ wishlist: data.wishlist });
      showToast('Removed item from favorites', 'info');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleMoveToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Add to cart
      addToCart(product, 1);
      // Remove from wishlist
      const { data } = await api.post(`/auth/wishlist/${product._id}`);
      updateUser({ wishlist: data.wishlist });
      showToast('Moved item to shopping bag');
    } catch (err) {
      console.error('Error moving to cart:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-6">
        <h1 className="text-xl font-bold text-text-primary mb-2">Access Denied</h1>
        <p className="text-xs text-text-secondary mb-6 font-light">Please login to view your personal wishlist items.</p>
        <Link to="/login" className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full">
          Login Account
        </Link>
      </div>
    );
  }

  const wishlistItems = user.wishlist || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <span className="text-[10px] text-primary-start font-bold uppercase tracking-widest bg-primary-start/10 px-3 py-1 rounded-full w-fit">
        Favorites
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-4 mb-2">My Wishlist</h1>
      <p className="text-xs text-text-secondary mb-10 font-light">
        Your favorite products saved for later. Easily checkout saved items by adding them to your bag.
      </p>

      {loading ? (
        <p className="text-text-secondary text-xs font-light">Loading wishlist...</p>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-white border border-border-light rounded-2xl p-12 text-center max-w-sm mx-auto shadow-sm">
          <span className="text-4xl">❤️</span>
          <h2 className="font-bold text-text-primary mt-4 mb-1.5 text-base">Your wishlist is empty</h2>
          <p className="text-xs text-text-secondary mb-6 font-light leading-relaxed">
            Tap the heart icon on product cards while browsing catalog to add favorites here.
          </p>
          <Link to="/shop" className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((prod) => {
              if (prod && typeof prod === 'object') {
                return (
                  <motion.div
                    key={prod._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-border-light rounded-2xl p-4 flex flex-col group relative shadow-sm hover:shadow-md transition duration-200"
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => handleRemove(e, prod._id)}
                      className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white text-danger font-bold transition"
                    >
                      ✕
                    </button>

                    <Link to={`/product/${prod._id}`} className="aspect-[1/1] overflow-hidden rounded-xl bg-bg-soft flex items-center justify-center">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    </Link>

                    <div className="flex flex-col mt-4 flex-grow">
                      <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{prod.category}</span>
                      <h4 className="font-semibold text-text-primary text-xs truncate mt-0.5">{prod.name}</h4>
                      <span className="text-xs font-bold text-text-primary mt-2">${prod.price}</span>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto pt-4 border-t border-border-light/60">
                        <button
                          onClick={(e) => handleMoveToCart(e, prod)}
                          className="flex-grow bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white text-[10px] font-semibold py-2.5 rounded-full shadow-sm text-center uppercase tracking-widest"
                        >
                          Move to Bag
                        </button>
                      </div>
                    </div>
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
