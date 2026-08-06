import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Wizard Steps: 1 = Shipping, 2 = Payment, 3 = Review
  const [step, setStep] = useState(1);

  // Form states pre-populated from user context defaults if they exist
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center px-6">
        <h1 className="text-xl font-serif font-bold text-primary mb-2">Cart is empty</h1>
        <p className="text-xs text-gray-500 mb-6 font-light">Add products to your cart before checking out.</p>
        <Link to="/shop" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full">
          Shop Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      product: item._id,
    }));

    try {
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: { address: street, city, postalCode, country },
        paymentMethod,
        totalPrice,
      });

      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Order</span>
      <h1 className="text-3xl font-serif font-bold text-primary mt-1">Checkout</h1>
      
      {/* Wizard Progress Bar */}
      <div className="flex items-center gap-4 my-8 border-b border-[#ECECEC] pb-4">
        {[
          { num: 1, label: 'Shipping Address' },
          { num: 2, label: 'Payment Details' },
          { num: 3, label: 'Confirm Review' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= s.num ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-400'
            }`}>
              {s.num}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-gray-800' : 'text-gray-450'}`}>
              {s.label}
            </span>
            {s.num < 3 && <span className="text-gray-300 text-xs">&rarr;</span>}
          </div>
        ))}
      </div>

      {error && <p className="bg-red-50 text-[#E24A4A] text-xs p-3 rounded-xl mb-4 font-medium">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT FORM COMPONENT */}
        <div className="md:col-span-2">
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <h3 className="font-serif font-bold text-primary text-base">Delivery Coordinates</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Street address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Forest Lane, Apt 4B"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    placeholder="City name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postal / ZIP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</label>
                <input
                  type="text"
                  placeholder="Country name"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border border-[#ECECEC] focus:border-primary focus:outline-none rounded-2xl p-3.5 text-xs bg-[#FAF8F4]/80 focus:bg-white"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (street && city && postalCode && country) setStep(2);
                  else alert('Please fill in all shipping coordinates');
                }}
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition self-start mt-2"
              >
                Proceed to Payment &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <h3 className="font-serif font-bold text-primary text-base">Payment Method Selection</h3>

              <div className="flex flex-col gap-4">
                {[
                  { id: 'cod', name: 'Cash on Delivery', desc: 'Settle payment in cash upon shipping receipt.' },
                  { id: 'card', name: 'Card', desc: 'Secure billing checkout using simulated card integrations.' },
                ].map((m) => (
                  <label
                    key={m.id}
                    onClick={() => setPaymentMethod(m.name)}
                    className={`border p-5 rounded-3xl flex flex-col gap-1 cursor-pointer transition ${
                      paymentMethod === m.name
                        ? 'border-primary bg-primary/5'
                        : 'border-[#ECECEC] hover:bg-[#FAF8F4]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        checked={paymentMethod === m.name}
                        onChange={() => {}}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="font-bold text-sm text-gray-800">{m.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-light pl-6.5">{m.desc}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition"
                >
                  Review Order Details &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRM REVIEW */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h3 className="font-serif font-bold text-primary text-base mb-2">Final Review</h3>
                <p className="text-xs text-gray-500 font-light">Ensure your delivery coordinates and billing selections are correct before confirmation.</p>
              </div>

              <div className="border border-[#ECECEC] p-5 rounded-3xl flex flex-col gap-3 bg-white text-xs leading-relaxed font-light shadow-sm">
                <p><strong>Shipping Logistics:</strong> {street}, {city}, {postalCode}, {country}</p>
                <p><strong>Payment Selector:</strong> {paymentMethod}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition disabled:opacity-50"
                >
                  {placing ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT SUMMARY DETAIL */}
        <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl h-fit flex flex-col gap-4 shadow-sm">
          <h3 className="font-serif font-bold text-primary text-sm border-b border-[#ECECEC] pb-3">Invoice Details</h3>
          
          <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-gray-500 font-light">
                <span className="line-clamp-1 flex-grow pr-4">{item.name} &times; {item.quantity}</span>
                <span className="font-bold text-gray-800 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#ECECEC]/60 pt-3 flex justify-between items-center text-gray-800 text-xs">
            <span>Subtotal</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-gray-800 text-xs">
            <span>Shipping</span>
            <span className="text-success font-bold uppercase">Free</span>
          </div>

          <div className="border-t border-[#ECECEC]/60 pt-3 flex justify-between items-center text-gray-850 font-black text-sm">
            <span>Total Cost</span>
            <span className="text-primary text-base font-extrabold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;