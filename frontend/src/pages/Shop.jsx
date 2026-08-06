import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('pageNumber')) || 1);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      params.pageNumber = page;

      const { data } = await api.get('/products', { params });
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = {};
    if (keyword.trim()) urlParams.keyword = keyword.trim();
    if (selectedCategory && selectedCategory !== 'All') urlParams.category = selectedCategory;
    if (minPrice) urlParams.minPrice = minPrice;
    if (maxPrice) urlParams.maxPrice = maxPrice;
    if (sortBy) urlParams.sortBy = sortBy;
    urlParams.pageNumber = page;

    setSearchParams(urlParams);
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortBy, page, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
  };

  const categoriesList = ['All', ...categories.map((c) => c.name)];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10 pb-6 border-b border-[#ECECEC]">
        <div>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Catalog</span>
          <h1 className="text-3xl font-serif font-bold text-primary mt-1">Shop Collections</h1>
          <p className="text-xs text-gray-500 font-light mt-1">Showing {totalProducts} curated products</p>
        </div>

        {/* Desktop Sorting */}
        <div className="hidden sm:flex items-center gap-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border border-[#ECECEC] text-xs font-semibold text-gray-700 bg-white rounded-full px-4 py-2 focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="topRated">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* DESKTOP SIDEBAR FILTERS */}
        <div className="hidden lg:flex flex-col gap-8 p-6 bg-white border border-[#ECECEC] rounded-3xl h-fit shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-[#ECECEC]">
            <h3 className="font-serif font-bold text-primary text-base">Filter By</h3>
            <button onClick={handleResetFilters} className="text-[10px] font-bold uppercase tracking-widest text-[#E24A4A] hover:underline">
              Clear All
            </button>
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary focus:bg-white"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-2.5 text-gray-400 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Categories list */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</h4>
            <div className="flex flex-col gap-1.5 mt-1">
              {categoriesList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`text-left text-xs py-2 px-3 rounded-xl font-semibold transition-colors duration-150 ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-[#FAF8F4] hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Boundaries */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price Limit ($)</h4>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white"
              />
              <span className="text-gray-300 text-xs">&ndash;</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* MOBILE FILTER SWITCHERS */}
        <div className="lg:hidden flex items-center justify-between gap-4 w-full">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-white border border-[#ECECEC] px-5 py-2.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm"
          >
            Filters
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </button>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border border-[#ECECEC] text-xs font-semibold text-gray-700 bg-white rounded-full px-4 py-2.5 focus:outline-none shadow-sm"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="topRated">Top Rated</option>
          </select>
        </div>

        {/* PRODUCT LIST GRID */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white aspect-[4/5] rounded-3xl animate-pulse border border-[#ECECEC]/30" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#ECECEC]/60 rounded-3xl max-w-md mx-auto w-full shadow-sm">
              <span className="text-4xl">🔍</span>
              <h2 className="font-serif font-bold text-primary mt-4 mb-2 text-lg">No products found</h2>
              <p className="text-xs text-gray-500 mb-6 px-6 font-light leading-relaxed">
                We couldn't find any products matching your active filters. Try adjusting your keyword search or pricing criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm hover:bg-primary/95"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2.5 mt-6 border-t border-[#ECECEC]/40 pt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl border border-[#ECECEC] flex items-center justify-center text-sm font-semibold hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: pages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx + 1)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                        page === idx + 1
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-[#ECECEC] bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="w-9 h-9 rounded-xl border border-[#ECECEC] flex items-center justify-center text-sm font-semibold hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS PANEL */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto flex flex-col gap-6 relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#ECECEC]">
                <h3 className="font-serif font-bold text-primary text-lg">Filter Choices</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Keyword */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-primary"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => setKeyword('')}
                      className="absolute right-2 top-2 text-gray-400 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>

              {/* Categories */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</h4>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {categoriesList.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      className={`text-xs py-2.5 px-3.5 rounded-xl font-semibold transition ${
                        selectedCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-[#FAF8F4] text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price Limit ($)</h4>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                  <span className="text-gray-400 text-xs">&ndash;</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                }}
                    className="w-full bg-[#FAF8F4] border border-[#ECECEC] rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-[#E24A4A] bg-red-50 rounded-xl uppercase tracking-wider"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-white bg-primary rounded-xl uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
