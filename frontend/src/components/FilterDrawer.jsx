import { motion, AnimatePresence } from 'framer-motion';

const FilterDrawer = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  ratingFilter,
  setRatingFilter,
  inStockOnly,
  setInStockOnly,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
        {/* Overlay dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.25 }}
          className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto flex flex-col gap-6 relative shadow-md"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border-light">
            <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Filters</h3>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Categories</h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {['All', ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs py-2 px-3.5 rounded-full font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-sm'
                      : 'bg-bg-soft text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Price Limit ($)</h4>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-bg-soft border border-border-light rounded-xl p-2.5 text-xs focus:outline-none"
              />
              <span className="text-text-secondary text-xs">&ndash;</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-bg-soft border border-border-light rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Customer Rating</h4>
            <div className="flex flex-col gap-1.5 mt-1">
              {[
                { label: '4.0 & Up', val: 4 },
                { label: '3.0 & Up', val: 3 },
              ].map((r) => (
                <label key={r.val} className="flex items-center gap-2 text-xs text-text-primary cursor-pointer font-light">
                  <input
                    type="radio"
                    checked={ratingFilter === r.val}
                    onChange={() => setRatingFilter(r.val)}
                    className="accent-primary-start"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer font-light">
                <input
                  type="radio"
                  checked={ratingFilter === 0}
                  onChange={() => setRatingFilter(0)}
                  className="accent-primary-start"
                />
                <span>All Ratings</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Availability</h4>
            <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer font-light mt-1">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-primary-start w-4 h-4 rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto pt-6 flex gap-3">
            <button
              onClick={() => {
                onReset();
                onClose();
              }}
              className="flex-1 py-3 text-xs font-bold text-danger bg-red-50 rounded-full uppercase tracking-wider"
            >
              Clear Filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-primary-start to-primary-end rounded-full uppercase tracking-wider shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FilterDrawer;
