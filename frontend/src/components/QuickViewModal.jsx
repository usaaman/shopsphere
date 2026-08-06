import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white border border-border-light rounded-3xl w-full max-w-2xl overflow-hidden relative shadow-md p-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-text-secondary hover:text-text-primary text-sm font-bold p-1"
          >
            ✕
          </button>

          {/* Left: Image */}
          <div className="aspect-[1/1] bg-bg-soft rounded-2xl overflow-hidden flex items-center justify-center border border-border-light/40">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] text-primary-start font-bold uppercase tracking-widest bg-primary-start/10 px-2.5 py-0.5 rounded-full w-fit">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-text-primary mt-2">{product.name}</h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[#F59E0B] text-xs">★</span>
                <span className="text-[10px] font-bold text-text-primary">{product.rating.toFixed(1)}</span>
                <span className="text-[10px] text-text-secondary font-light">({product.numReviews} reviews)</span>
              </div>
            </div>

            <p className="text-xl font-bold text-text-primary">${product.price.toFixed(2)}</p>
            <p className="text-xs text-text-secondary leading-relaxed font-light line-clamp-3">{product.description}</p>

            {/* Qty */}
            {product.stock > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-border-light text-xs font-semibold text-text-primary rounded-full px-3.5 py-1 bg-white focus:outline-none focus:border-primary-start max-w-[100px]"
                >
                  {Array.from({ length: Math.min(product.stock, 5) }).map((_, idx) => (
                    <option key={idx} value={idx + 1}>{idx + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold py-2.5 rounded-full text-xs uppercase tracking-widest shadow-sm disabled:opacity-50"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
