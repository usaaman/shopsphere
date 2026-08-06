import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/api';

const SidebarRight = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { data } = await api.get('/products', { params: { pageSize: 2 } });
        setRecommended(data.products || data || []);
      } catch (error) {
        console.error('Error loading recommendations in sidebar:', error);
      }
    };
    fetchRecommended();
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside
      className={`fixed top-0 bottom-0 right-0 z-40 w-80 bg-white border-l border-border-light p-5 flex flex-col gap-6 transform lg:transform-none lg:sticky transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
    >
      {/* Mobile close button */}
      <button onClick={onClose} className="lg:hidden absolute top-4 left-4 text-text-secondary hover:text-text-primary text-sm font-bold">
        ✕
      </button>

      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b border-border-light">
        <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">My Cart ({cartCount})</h3>
      </div>

      {/* Cart List */}
      <div className="flex flex-col gap-4 flex-grow overflow-y-auto max-h-[300px] pr-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center gap-2">
            <span className="text-2xl">🛒</span>
            <p className="text-xs text-text-secondary font-light">Your shopping bag is empty.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex gap-3 border-b border-border-light/40 pb-3 last:border-b-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-border-light/40" />
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-text-primary text-xs truncate">{item.name}</h4>
                <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-border-light rounded-full bg-bg-soft">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-0.5 text-text-secondary hover:bg-gray-150 text-[10px]"
                    >
                      &minus;
                    </button>
                    <span className="px-1 text-[10px] font-bold text-text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2 py-0.5 text-text-secondary hover:bg-gray-150 text-[10px]"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-danger hover:underline text-[9px] font-bold uppercase ml-auto">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Details */}
      <div className="flex flex-col gap-3.5 border-t border-border-light pt-4 mt-auto">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold text-text-primary">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-text-secondary border-b border-border-light/60 pb-3.5">
          <span>Shipping fees</span>
          <span className="font-semibold text-success uppercase">Free</span>
        </div>
        <div className="flex justify-between items-center text-text-primary font-black text-sm">
          <span>Total</span>
          <span className="text-primary-start text-base font-extrabold">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={() => {
            onClose();
            navigate('/checkout');
          }}
          disabled={cartItems.length === 0}
          className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold py-3.5 rounded-full text-xs uppercase tracking-widest transition shadow-sm disabled:opacity-50"
        >
          Checkout ({cartCount}) &rarr;
        </button>

        {/* Accepted Payment Logos */}
        <div className="flex justify-center gap-3 opacity-30 mt-1">
          {['VISA', 'MC', 'PAYPAL', 'APPLE', 'GOOGLE'].map((logo, idx) => (
            <span key={idx} className="text-[9px] font-bold tracking-widest">{logo}</span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="border-t border-border-light pt-4 mt-2">
          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">You might also like</h4>
          <div className="flex flex-col gap-3">
            {recommended.map((prod) => (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`}
                onClick={onClose}
                className="flex items-center gap-3 hover:bg-bg-soft/45 p-1 rounded-xl transition"
              >
                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-border-light/35" />
                <div className="min-w-0 flex-grow">
                  <h5 className="text-[11px] font-semibold text-text-primary truncate">{prod.name}</h5>
                  <p className="text-[10px] font-bold mt-0.5 text-primary-start">${prod.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarRight;
