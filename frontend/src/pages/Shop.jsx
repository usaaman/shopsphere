import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import FilterDrawer from '../components/FilterDrawer';
import QuickViewModal from '../components/QuickViewModal';
import api from '../api/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search experience states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searchHistory, setSearchHistory] = useState(() => {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [ratingFilter, setRatingFilter] = useState(Number(searchParams.get('rating')) || 0);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [page, setPage] = useState(Number(searchParams.get('pageNumber')) || 1);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals / Drawers toggles
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fetch Categories
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

  // Live Suggestions Handler
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', { params: { keyword: keyword.trim(), pageSize: 5 } });
        setSuggestions(data.products || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      if (ratingFilter) params.rating = ratingFilter;
      if (inStockOnly) params.inStock = 'true';
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
    if (ratingFilter) urlParams.rating = ratingFilter;
    if (inStockOnly) urlParams.inStock = 'true';
    urlParams.pageNumber = page;

    setSearchParams(urlParams);
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortBy, ratingFilter, inStockOnly, page, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Save to history
      const updatedHistory = [keyword.trim(), ...searchHistory.filter((h) => h !== keyword.trim())].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
    setPage(1);
    setShowSuggestions(false);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setRatingFilter(0);
    setInStockOnly(false);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-8">
      {/* 1. STICKY TOP SEARCH BAR & CATEGORY PILLS */}
      <div className="flex flex-col gap-5 sticky top-16 z-20 bg-bg-soft/90 backdrop-blur pb-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Top Search with suggestions dropdown */}
          <div className="relative w-full max-w-lg flex flex-col">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-white border border-border-light rounded-full py-3.5 pl-5 pr-12 text-xs focus:outline-none focus:border-primary-start focus:bg-white shadow-sm transition-all"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    setSuggestions([]);
                  }}
                  className="absolute right-12 text-text-secondary text-xs hover:text-text-primary p-1"
                >
                  ✕
                </button>
              )}
              <button type="submit" className="absolute right-4 text-text-secondary hover:text-primary-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                </svg>
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (keyword.trim() || searchHistory.length > 0) && (
              <div className="absolute top-[52px] left-0 right-0 bg-white border border-border-light rounded-2xl shadow-md p-4 flex flex-col gap-3.5 z-30">
                <div className="flex justify-between items-center pb-2 border-b border-border-light">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Suggestions</span>
                  <button onClick={() => setShowSuggestions(false)} className="text-[9px] text-text-secondary hover:text-text-primary font-bold">Close</button>
                </div>

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest pl-1">Recent Searches</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {searchHistory.map((hist, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setKeyword(hist);
                            setPage(1);
                            setShowSuggestions(false);
                          }}
                          className="bg-bg-soft text-text-secondary hover:text-text-primary px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {hist}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Suggestions list */}
                {keyword.trim() && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest pl-1">Matching Products</span>
                    {suggestions.length === 0 ? (
                      <p className="text-[11px] text-text-secondary font-light pl-1">No matches found</p>
                    ) : (
                      suggestions.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            setKeyword(p.name);
                            setPage(1);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-3 text-left w-full hover:bg-bg-soft/50 p-1.5 rounded-xl transition"
                        >
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded-lg border border-border-light/40" />
                          <span className="text-[11px] font-semibold text-text-primary truncate flex-grow">{p.name}</span>
                          <span className="text-[11px] font-bold text-text-primary">${p.price}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sort & Drawer Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 bg-white border border-border-light px-5 py-3 rounded-full text-xs font-bold text-text-primary shadow-sm hover:shadow-md transition-all"
            >
              Filter Options
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border border-border-light text-xs font-bold text-text-primary bg-white rounded-full px-4 py-3 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category horizontal scroll bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {['All', ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`text-xs py-2.5 px-5 rounded-full font-bold uppercase tracking-wider transition shrink-0 shadow-sm ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-50 border border-border-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. RESPONSIVE PRODUCT GRID (4 columns desktop, 3 columns tablet, 2 columns mobile) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border-light rounded-3xl max-w-sm mx-auto w-full shadow-sm">
          <span className="text-3.5xl">🔍</span>
          <h2 className="font-bold text-text-primary mt-4 mb-2 text-base">No products matched</h2>
          <p className="text-xs text-text-secondary mb-6 px-6 font-light leading-relaxed">
            Adjust price limits or clear filters to look up other products.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      )}

      {/* 3. PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 border-t border-border-light pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl border border-border-light flex items-center justify-center text-sm font-semibold hover:bg-white transition disabled:opacity-30"
          >
            &larr;
          </button>
          {Array.from({ length: pages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                page === idx + 1
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-sm'
                  : 'border border-border-light bg-white hover:bg-gray-50 text-text-secondary'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="w-9 h-9 rounded-xl border border-border-light flex items-center justify-center text-sm font-semibold hover:bg-white transition disabled:opacity-30"
          >
            &rarr;
          </button>
        </div>
      )}

      {/* 4. MODALS & DRAWERS */}
      <FilterDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        onReset={handleResetFilters}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;
