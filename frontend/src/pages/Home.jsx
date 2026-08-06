import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { user, updateUser } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products || data || []);
      } catch (error) {
        console.error('Error loading homepage products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Timer Interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 18 }; // reset
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWishlistToggle = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setWishlistLoading(true);
    try {
      const { data } = await api.post(`/auth/wishlist/${id}`);
      updateUser({ wishlist: data.wishlist });
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const isWishlisted = (id) =>
    user && user.wishlist && Array.isArray(user.wishlist)
      ? user.wishlist.some((itemId) => (typeof itemId === 'object' ? itemId._id : itemId) === id)
      : false;

  // Split products for section mapping based on priority database fields set by admin
  const bestDealsList = products.filter((p) => p.bestSeller);
  const bestDeals = bestDealsList.length > 0
    ? bestDealsList.slice(0, 4)
    : products.filter((p) => p.rating >= 4.0).slice(0, 4);

  const recommendedList = products.filter((p) => p.featured);
  const recommended = recommendedList.length > 0
    ? recommendedList.slice(0, 4)
    : products.filter((p) => p.stock > 0).slice(4, 8);

  return (
    <div className="flex flex-col gap-10">
      {/* 1. HERO SLIDER BANNER (Purple luxury aesthetic) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#7C5CFF] to-[#5B8CFF] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
        <div className="flex flex-col gap-5 max-w-md">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full w-fit">
            New Collection
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
            Find Your Style,<br />Love Your Look ✨
          </h1>
          <p className="text-xs text-white/80 font-light leading-relaxed">
            Discover the latest trends in fashion, beauty, and lifestyle products curated for you.
          </p>
          <Link
            to="/shop"
            className="bg-white text-primary-start text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-full shadow-sm hover:bg-gray-50 transition w-fit mt-2"
          >
            Shop Now &rarr;
          </Link>
        </div>

        {/* Model Image Showcase */}
        <div className="relative w-64 aspect-[1/1] overflow-hidden rounded-2xl bg-white/10 shrink-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
            alt="Showcase Model"
            className="w-full h-full object-cover object-top opacity-90"
          />
        </div>
      </section>

      {/* 2. CATEGORIES BAR (Icons row) */}
      <section className="flex flex-wrap items-center justify-around gap-4 bg-white p-5 rounded-2xl border border-border-light shadow-sm">
        {[
          { label: 'Fashion', icon: '👚', bg: 'bg-red-50 text-red-500' },
          { label: 'Beauty', icon: '💄', bg: 'bg-pink-50 text-pink-500' },
          { label: 'Electronics', icon: '🎧', bg: 'bg-blue-50 text-blue-500' },
          { label: 'Home & Living', icon: '🛋️', bg: 'bg-amber-50 text-amber-500' },
          { label: 'Sports', icon: '👟', bg: 'bg-indigo-50 text-indigo-500' },
          { label: 'More', icon: '➕', bg: 'bg-gray-50 text-gray-500' },
        ].map((cat, idx) => (
          <Link
            key={idx}
            to="/shop"
            className="flex flex-col items-center gap-2 text-center group min-w-[70px]"
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${cat.bg} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
              {cat.icon}
            </span>
            <span className="text-[10px] font-semibold text-text-primary uppercase tracking-wider">{cat.label}</span>
          </Link>
        ))}
      </section>

      {/* 3. PROMO CARDS GRID (Flash Sale, Free Shipping, New Arrivals) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Flash Sale */}
        <div className="bg-white border border-border-light p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#EF4444]">Flash Sale</span>
            <h4 className="font-bold text-xs text-text-primary">Limited time deals</h4>
            <div className="flex gap-1.5 text-xs font-bold text-text-primary mt-1">
              <span className="bg-bg-soft px-2 py-1 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-bg-soft px-2 py-1 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-bg-soft px-2 py-1 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <span className="text-4xl bg-red-50 p-3 rounded-2xl">⏳</span>
        </div>

        {/* Card 2: Free Shipping */}
        <div className="bg-white border border-border-light p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary-start">Free Shipping</span>
            <h4 className="font-bold text-xs text-text-primary">On orders over $50</h4>
            <Link to="/shop" className="text-[10px] font-bold text-primary-start hover:underline mt-1.5 inline-block">
              Shop now &rarr;
            </Link>
          </div>
          <span className="text-4xl bg-blue-50 p-3 rounded-2xl">📦</span>
        </div>

        {/* Card 3: New Arrivals */}
        <div className="bg-white border border-border-light p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent">New Arrivals</span>
            <h4 className="font-bold text-xs text-text-primary">Check out the latest</h4>
            <Link to="/shop" className="text-[10px] font-bold text-accent hover:underline mt-1.5 inline-block">
              Shop now &rarr;
            </Link>
          </div>
          <span className="text-4xl bg-orange-50 p-3 rounded-2xl">🕶️</span>
        </div>
      </section>

      {/* 4. BEST DEALS FOR YOU (Central Deals Grid) */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b border-border-light pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Best Deals for You</h2>
            <p className="text-xs text-text-secondary font-light mt-0.5">Explore hot items with dynamic discounts</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-primary-start hover:underline uppercase tracking-wider">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white aspect-[4/4.5] rounded-2xl animate-pulse border border-border-light" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestDeals.map((prod) => (
              <div key={prod._id} className="bg-white border border-border-light rounded-2xl p-4 flex flex-col group relative shadow-sm hover:shadow-md transition duration-200">
                {/* Discount Tag */}
                <span className="absolute top-4 left-4 z-10 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#EF4444] text-white rounded-md">
                  -20%
                </span>

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => handleWishlistToggle(e, prod._id)}
                  disabled={wishlistLoading}
                  className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isWishlisted(prod._id) ? '#EF4444' : 'none'}
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke={isWishlisted(prod._id) ? '#EF4444' : '#111827'}
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                <Link to={`/product/${prod._id}`} className="aspect-[1/1] overflow-hidden rounded-xl bg-bg-soft flex items-center justify-center">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                </Link>

                <div className="flex flex-col mt-4">
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{prod.category}</span>
                  <h4 className="font-semibold text-text-primary text-xs truncate mt-0.5">{prod.name}</h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[#F59E0B] text-xs">★</span>
                    <span className="text-[9px] font-bold text-text-primary">{prod.rating.toFixed(1)}</span>
                    <span className="text-[9px] text-text-secondary font-light">({prod.numReviews})</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-light/60 pt-3 mt-4">
                    <div>
                      <span className="text-xs font-bold text-text-primary">${prod.price}</span>
                      <span className="text-[9px] text-text-secondary line-through ml-2">${(prod.price * 1.25).toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(prod)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-start to-primary-end text-white flex items-center justify-center shadow-sm hover:opacity-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. RECOMMENDED FOR YOU */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end border-b border-border-light pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Recommended for You</h2>
            <p className="text-xs text-text-secondary font-light mt-0.5">Handpicked products fitting your style credentials</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-primary-start hover:underline uppercase tracking-wider">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white aspect-[4/4.5] rounded-2xl animate-pulse border border-border-light" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((prod) => (
              <div key={prod._id} className="bg-white border border-border-light rounded-2xl p-4 flex flex-col group relative shadow-sm hover:shadow-md transition duration-200">
                {/* Wishlist Heart */}
                <button
                  onClick={(e) => handleWishlistToggle(e, prod._id)}
                  disabled={wishlistLoading}
                  className="absolute top-4 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isWishlisted(prod._id) ? '#EF4444' : 'none'}
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke={isWishlisted(prod._id) ? '#EF4444' : '#111827'}
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>

                <Link to={`/product/${prod._id}`} className="aspect-[1/1] overflow-hidden rounded-xl bg-bg-soft flex items-center justify-center">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                </Link>

                <div className="flex flex-col mt-4">
                  <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">{prod.category}</span>
                  <h4 className="font-semibold text-text-primary text-xs truncate mt-0.5">{prod.name}</h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[#F59E0B] text-xs">★</span>
                    <span className="text-[9px] font-bold text-text-primary">{prod.rating.toFixed(1)}</span>
                    <span className="text-[9px] text-text-secondary font-light">({prod.numReviews})</span>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1.5 mt-3">
                    <span className="w-3 h-3 rounded-full bg-gray-250 border border-white cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-orange-200 border border-white cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-amber-800 border border-white cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between border-t border-border-light/60 pt-3 mt-4">
                    <span className="text-xs font-bold text-text-primary">${prod.price}</span>
                    <button
                      onClick={() => addToCart(prod)}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-start to-primary-end text-white flex items-center justify-center shadow-sm hover:opacity-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;