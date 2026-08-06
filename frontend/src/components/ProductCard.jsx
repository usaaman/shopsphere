import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useContext(CartContext);
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if item exists in wishlist
  const isWishlisted = user && user.wishlist && Array.isArray(user.wishlist)
    ? user.wishlist.some((id) => (typeof id === 'object' ? id._id : id) === product._id)
    : false;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      const { data } = await api.post(`/auth/wishlist/${product._id}`);
      updateUser({ wishlist: data.wishlist });
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-[#F59E0B] text-[11px]">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-200 text-[11px]">★</span>
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col group relative border border-border-light shadow-sm hover:shadow-md"
    >
      {/* Favorite Heart trigger */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-3.5 right-3.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-colors duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWishlisted ? '#EF4444' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke={isWishlisted ? '#EF4444' : '#111827'}
          className="w-4 h-4 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      {/* Item badge tags */}
      {product.rating >= 4.5 && (
        <span className="absolute top-3.5 left-3.5 z-10 text-[8px] font-bold uppercase tracking-wider px-2 py-1 bg-gradient-to-r from-primary-start to-primary-end text-white rounded-md shadow-sm">
          Top Rated
        </span>
      )}

      {/* Photo Aspect */}
      <div className="aspect-[1/1] bg-bg-soft overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="bg-white/90 backdrop-blur text-text-primary text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-md hover:bg-white transition"
            >
              Quick View
            </button>
          </div>
        )}

        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-danger text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            Sold Out
          </span>
        )}
      </div>

      {/* Content details */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mb-1">
          {product.category}
        </span>
        
        {/* Navigation link wrapper */}
        <Link to={`/product/${product._id}`} className="font-semibold text-text-primary text-xs line-clamp-1 hover:text-primary-start transition-colors">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">{renderStars(product.rating || 0)}</div>
          <span className="text-[9px] text-text-secondary font-semibold">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Bottom pricing */}
        <div className="mt-auto pt-3 flex justify-between items-center border-t border-border-light/60">
          <div>
            <span className="text-xs font-bold text-text-primary">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[9px] text-text-secondary line-through ml-2">
              ${(product.price * 1.3).toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className={`text-[9px] font-bold uppercase tracking-widest px-4.5 py-2 rounded-full shadow-sm transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white'
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
