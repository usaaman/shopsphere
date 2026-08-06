import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Step 1: Shipping, Step 2: Payment, Step 3: Review
  const [step, setStep] = useState(1);

  // Form states prefilled from user details
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
        <h1 className="text-xl font-bold text-text-primary mb-2">Cart is empty</h1>
        <p className="text-xs text-text-secondary mb-6 font-light">Add products to your cart before checking out.</p>
        <Link to="/shop" className="bg-gradient-to-r from-primary-start to-primary-end text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full">
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
      showToast('Order placed successfully!', 'success');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      showToast('Failed to place order', 'danger');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="text-[10px] text-primary-start font-bold uppercase tracking-widest bg-primary-start/10 px-3 py-1 rounded-full w-fit">
        Order Checkout
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-4">Checkout</h1>
      
      {/* Wizard Steps indicator */}
      <div className="flex items-center gap-4 my-8 border-b border-border-light pb-4">
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Review' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= s.num ? 'bg-primary-start text-white shadow-sm' : 'bg-gray-100 text-gray-400'
            }`}>
              {s.num}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-text-primary' : 'text-text-secondary'}`}>
              {s.label}
            </span>
            {s.num < 3 && <span className="text-text-secondary/40 text-xs">&rarr;</span>}
          </div>
        ))}
      </div>

      {error && <p className="bg-red-50 text-danger text-xs p-3 rounded-xl mb-4 font-medium">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN: STEPS */}
        <div className="md:col-span-2">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <h3 className="font-bold text-text-primary text-sm">Shipping Coordinates</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Postal Code</label>
                  <input
                    type="text"
                    placeholder="ZIP / Postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border border-border-light focus:border-primary-start focus:outline-none rounded-2xl p-3.5 text-xs bg-bg-soft/75 focus:bg-white"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (street && city && postalCode && country) setStep(2);
                  else alert('Please fill in all shipping fields');
                }}
                className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition self-start mt-2 shadow-sm"
              >
                Proceed to Payment &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <h3 className="font-bold text-text-primary text-sm">Payment Details</h3>

              <div className="flex flex-col gap-4">
                {[
                  { id: 'cod', name: 'Cash on Delivery', desc: 'Settle invoice total with cash upon delivery receipt.' },
                  { id: 'card', name: 'Card', desc: 'Secure debit/credit processing using simulated integration.' },
                ].map((m) => (
                  <label
                    key={m.id}
                    onClick={() => setPaymentMethod(m.name)}
                    className={`border p-5 rounded-2xl flex flex-col gap-1 cursor-pointer transition ${
                      paymentMethod === m.name
                        ? 'border-primary-start bg-primary-start/5'
                        : 'border-border-light hover:bg-bg-soft/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        checked={paymentMethod === m.name}
                        onChange={() => {}}
                        className="accent-primary-start w-4 h-4"
                      />
                      <span className="font-bold text-xs text-text-primary">{m.name}</span>
                    </div>
                    <span className="text-xs text-text-secondary font-light pl-6.5">{m.desc}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition shadow-sm"
                >
                  Review Order Details &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-100 hover:bg-gray-250 text-text-secondary font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-text-primary text-sm mb-1.5">Review & Confirm</h3>
                <p className="text-xs text-text-secondary font-light">Confirm your shipping coordinates and payment choice before completing transaction.</p>
              </div>

              <div className="border border-border-light p-5 rounded-2xl flex flex-col gap-3 bg-white text-xs leading-relaxed font-light shadow-sm">
                <p><strong>Shipping:</strong> {street}, {city}, {postalCode}, {country}</p>
                <p><strong>Billing Selector:</strong> {paymentMethod}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full transition disabled:opacity-50 shadow-md"
                >
                  {placing ? 'Completing transaction...' : 'Confirm & Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-100 hover:bg-gray-250 text-text-secondary font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: INVOICE DETAIL */}
        <div className="bg-white border border-border-light p-6 rounded-2xl h-fit flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-text-primary text-xs border-b border-border-light pb-3">Invoice Details</h3>
          
          <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-text-secondary font-light">
                <span className="line-clamp-1 flex-grow pr-4">{item.name} &times; {item.quantity}</span>
                <span className="font-bold text-text-primary shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border-light/60 pt-3 flex justify-between items-center text-text-primary text-xs">
            <span>Subtotal</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-text-primary text-xs">
            <span>Shipping Logistics</span>
            <span className="text-success font-bold uppercase">Free</span>
          </div>

          <div className="border-t border-border-light/60 pt-3 flex justify-between items-center text-text-primary font-black text-sm">
            <span>Total Cost</span>
            <span className="text-primary-start text-base font-extrabold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;