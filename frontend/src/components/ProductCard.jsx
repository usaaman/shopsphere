import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const ProductCard = ({ product }) => {
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
          <span key={i} className="text-[#D8C3A5] text-xs">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-200 text-xs">★</span>
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-3xl overflow-hidden flex flex-col group relative shadow-sm hover:shadow-md border border-[#ECECEC]/30"
    >
      {/* Wishlist Toggle Heart */}
      <button
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur shadow-sm hover:bg-white transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWishlisted ? '#E24A4A' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={isWishlisted ? '#E24A4A' : '#1D1D1D'}
          className="w-4 h-4 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>

      {/* Navigation wrap */}
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Photo Container */}
        <div className="aspect-[4/5] bg-ivory overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {product.stock === 0 && (
            <span className="absolute bottom-4 left-4 bg-error text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md">
              Out of stock
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 flex flex-col flex-grow">
          <span className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1.5">
            {product.category}
          </span>
          <h3 className="font-serif font-semibold text-gray-800 text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex">{renderStars(product.rating || 0)}</div>
            <span className="text-[10px] text-gray-400 font-medium">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Pricing & Cart Button */}
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-[#ECECEC]/40">
            <span className="text-base font-extrabold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.stock > 0) addToCart(product);
              }}
              disabled={product.stock === 0}
              className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors duration-200 ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
