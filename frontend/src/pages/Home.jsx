import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products', { params: { pageSize: 4 } });
        setProducts(data.products || data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* LUXURY EDITORIAL HERO BANNER */}
      <section className="relative overflow-hidden bg-[#E2ECE9]/50 py-24 px-6 md:px-12 border-b border-[#ECECEC]/30">
        {/* Soft background shape */}
        <div className="absolute right-0 bottom-0 w-[45%] h-[90%] rounded-tl-full bg-[#E5ECE9] -z-10 hidden md:block" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
              Sustainable Lifestyle
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary tracking-tight leading-[1.1]">
              Better choices.<br />Beautiful living.
            </h1>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed font-light">
              Curated products made with organic, ethically sourced materials to bring clean, luxury styling into your sustainable everyday lifestyle.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                to="/shop"
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition shadow-sm"
              >
                Shop the Collection &rarr;
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Illustration area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="hidden md:flex justify-end relative"
          >
            <div className="relative w-80 aspect-[3/4] bg-white rounded-3xl shadow-sm border border-[#ECECEC]/60 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
                alt="Verdora Lifestyle"
                className="w-full h-full object-cover opacity-95"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST PILLARS SECTION */}
      <section className="max-w-7xl mx-auto px-6 w-full -mt-24 z-10">
        <div className="bg-white border border-[#ECECEC] rounded-3xl p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#ECECEC]">
          {[
            { label: 'Free Shipping', desc: 'On orders over $60', icon: '🚚' },
            { label: 'Easy Returns', desc: '30-day return window', icon: '🔄' },
            { label: 'Secure Payments', desc: '100% protected checkout', icon: '🔒' },
            { label: 'Customer Support', desc: 'Here to help anytime', icon: '💬' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 lg:first:pl-0 lg:last:pr-0">
              <span className="text-3xl text-primary bg-ivory w-12 h-12 flex items-center justify-center rounded-full shrink-0">{item.icon}</span>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-md mx-auto mb-10">
          <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">Shop by Collection</h2>
          <p className="text-xs text-gray-500 font-light mt-1.5">Refined categories curated for modern, beautiful living spaces.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: 'Electronics', icon: '🔌', query: '?category=Electronics' },
            { name: 'Clothing', icon: '👕', query: '?category=Clothing' },
            { name: 'Footwear', icon: '👟', query: '?category=Footwear' },
            { name: 'Home & Kitchen', icon: '🏡', query: '?category=Home%20%26%20Kitchen' },
            { name: 'Accessories', icon: '👓', query: '?category=Accessories' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop${cat.query}`}
              className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-[#ECECEC]/30 hover:border-primary/20 transition-all duration-300 w-36 shrink-0 text-center group"
            >
              <span className="text-4xl group-hover:scale-105 transition-transform duration-300">{cat.icon}</span>
              <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTED BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">Best Sellers</h2>
            <p className="text-xs text-gray-500 font-light mt-1">Explore our most popular sustainable products</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-primary hover:underline tracking-widest uppercase"
          >
            View All Products &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white aspect-[4/5] rounded-3xl animate-pulse border border-[#ECECEC]/30" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found. Seed products via seeder.js inside backend.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;