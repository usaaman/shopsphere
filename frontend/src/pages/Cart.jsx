import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-4xl">🛒</span>
        <h1 className="text-2xl font-serif font-bold text-primary mt-6 mb-2">Your Cart is Empty</h1>
        <p className="text-xs text-gray-500 max-w-sm mb-6 font-light">
          Your shopping cart is currently empty. Explore our handpicked collections to add items.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-7 py-3.5 rounded-full transition shadow-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Shopping</span>
      <h1 className="text-3xl font-serif font-bold text-primary mt-1 mb-10">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: ITEM LIST */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <motion.div
              key={item._id}
              layout
              className="flex items-center justify-between border border-[#ECECEC]/60 p-5 rounded-3xl shadow-sm bg-white gap-4 hover:border-primary/10 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-2xl border border-[#ECECEC]/30"
                />
                <div>
                  <h3 className="font-serif font-semibold text-gray-800 text-base line-clamp-1">{item.name}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                  <p className="text-sm font-extrabold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Adjustments */}
              <div className="flex items-center gap-5">
                <div className="flex items-center border border-[#ECECEC] rounded-full overflow-hidden bg-[#FAF8F4]/60">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1.5 text-gray-500 hover:bg-gray-150 transition font-bold"
                  >
                    &minus;
                  </button>
                  <span className="px-2 text-xs font-bold text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-500 hover:bg-gray-150 transition font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-400 hover:text-[#E24A4A] p-1 transition"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN: INVOICE SUMMARY */}
        <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl h-fit flex flex-col gap-5 shadow-sm">
          <h3 className="font-serif font-bold text-primary text-base border-b border-[#ECECEC] pb-3">Invoice Details</h3>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Items count</span>
            <span className="font-semibold text-gray-800">{cartCount} units</span>
          </div>

          <div className="flex justify-between text-xs text-gray-500 border-b border-[#ECECEC] pb-3">
            <span>Shipping fees</span>
            <span className="font-semibold text-success">FREE</span>
          </div>

          <div className="flex justify-between items-center text-gray-850 font-black text-base mt-2">
            <span>Subtotal</span>
            <span className="text-gray-950 text-lg">${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3.5 rounded-full text-xs uppercase tracking-widest transition mt-3 shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;