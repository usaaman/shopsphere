import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'PROMO20') {
      setDiscountPercent(20);
      showToast('Coupon PROMO20 applied: 20% discount!', 'success');
    } else {
      showToast('Invalid coupon code', 'danger');
    }
  };

  // Free shipping threshold = $50
  const freeShippingThreshold = 50;
  const shippingProgress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - totalPrice, 0);

  const finalTotal = totalPrice * (1 - discountPercent / 100);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-4xl">🛒</span>
        <h1 className="text-xl font-bold text-text-primary mt-6 mb-1.5">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-text-secondary max-w-xs mb-6 font-light">
          Your bag is empty. Explore our handpicked collections to add items.
        </p>
        <Link
          to="/shop"
          className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold uppercase tracking-widest px-7 py-3.5 rounded-full shadow-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <span className="text-[10px] text-primary-start font-bold uppercase tracking-widest bg-primary-start/10 px-3 py-1 rounded-full w-fit">
        Shopping Bag
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-4 mb-10">Review Your Items</h1>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white border border-border-light p-5 rounded-2xl mb-8 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs text-text-primary">
          {remainingForFreeShipping > 0 ? (
            <p>You are <strong className="text-primary-start">${remainingForFreeShipping.toFixed(2)}</strong> away from <strong>FREE SHIPPING</strong>!</p>
          ) : (
            <p className="text-success font-bold">🎉 You qualify for FREE SHIPPING!</p>
          )}
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{shippingProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-bg-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-start to-primary-end transition-all duration-500"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <motion.div
              key={item._id}
              layout
              className="flex items-center justify-between border border-border-light p-5 rounded-2xl shadow-sm bg-white gap-4 hover:border-primary-start/10 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-border-light/40"
                />
                <div>
                  <h3 className="font-semibold text-text-primary text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                  <p className="text-xs font-bold text-text-primary mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Adjust qty */}
              <div className="flex items-center gap-5">
                <div className="flex items-center border border-border-light rounded-full overflow-hidden bg-bg-soft">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1.5 text-text-secondary hover:bg-gray-150 transition font-bold"
                  >
                    &minus;
                  </button>
                  <span className="px-1 text-xs font-bold text-text-primary">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1.5 text-text-secondary hover:bg-gray-150 transition font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-text-secondary hover:text-danger p-1 transition"
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

        {/* RIGHT SUMMARY */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-border-light p-6 rounded-2xl h-fit flex flex-col gap-5 shadow-sm">
            <h3 className="font-bold text-text-primary text-sm border-b border-border-light pb-3">Invoice Details</h3>

            <div className="flex justify-between text-xs text-text-secondary">
              <span>Items count</span>
              <span className="font-semibold text-text-primary">{cartCount} units</span>
            </div>

            <div className="flex justify-between text-xs text-text-secondary">
              <span>Subtotal</span>
              <span className="font-semibold text-text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-xs text-success">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-semibold">- ${(totalPrice * discountPercent / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-text-secondary border-b border-border-light pb-3">
              <span>Shipping fees</span>
              <span className="font-semibold text-success">FREE</span>
            </div>

            <div className="flex justify-between items-center text-text-primary font-black text-sm mt-2">
              <span>Total Cost</span>
              <span className="text-primary-start text-base font-extrabold">${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold py-3.5 rounded-full text-xs uppercase tracking-widest transition mt-3 shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="bg-white border border-border-light p-5 rounded-2xl shadow-sm flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Apply Coupon</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-bg-soft border border-border-light rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-start focus:bg-white flex-grow uppercase"
              />
              <button
                type="submit"
                className="bg-text-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-95"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;