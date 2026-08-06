import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePayOrder = async () => {
    setPaying(true);
    try {
      await api.put(`/orders/${id}/pay`);
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500 text-sm">Loading order details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600 text-sm">{error}</p>;
  if (!order) return <p className="text-center mt-10 text-gray-500 text-sm">Order not found</p>;

  // Progress steps
  const steps = [
    { label: 'Placed', active: true, date: order.createdAt },
    { label: 'Paid', active: order.isPaid, date: order.paidAt },
    { label: 'Dispatched', active: order.isDelivered, date: order.deliveredAt },
    { label: 'Delivered', active: order.isDelivered, date: order.deliveredAt },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <Link to="/profile" className="text-xs font-semibold text-primary hover:underline">
            &larr; Back to profile
          </Link>
          <h1 className="text-2xl font-serif font-bold text-primary mt-1">Order #{order._id.slice(-6)}</h1>
          <p className="text-xs text-gray-400 font-light mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Payment Simulation button */}
        {!order.isPaid && order.paymentMethod === 'Card' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePayOrder}
            disabled={paying}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition disabled:opacity-50"
          >
            {paying ? 'Processing...' : 'Simulate Payment'}
          </motion.button>
        )}
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white border border-[#ECECEC] p-8 rounded-3xl mb-8 shadow-sm">
        <h3 className="font-serif font-bold text-primary text-sm mb-6 uppercase tracking-wider">Delivery Progress</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center relative gap-6 sm:gap-4">
          {/* Progress bar line connector */}
          <div className="hidden sm:block absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-gray-150 -z-10" />
          <div
            className="hidden sm:block absolute top-[18px] left-[5%] h-0.5 bg-primary -z-10 transition-all duration-300"
            style={{
              width: `${
                order.isDelivered ? '90%' : order.isPaid ? '60%' : '30%'
              }`,
            }}
          />

          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-grow sm:flex-grow-0 z-10 w-full sm:w-auto">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                  step.active
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white border-gray-250 text-gray-400'
                }`}
              >
                {step.active ? '✓' : idx + 1}
              </div>
              <div className="text-left sm:text-center">
                <p className={`text-xs font-bold uppercase tracking-wider ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.active && step.date && (
                  <p className="text-[10px] text-gray-500 mt-0.5 font-light">
                    {new Date(step.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item summary / Invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm">
            <h3 className="font-serif font-bold text-primary text-sm mb-4">Items Summary</h3>
            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-4 py-2 border-b border-[#ECECEC]/30 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ivory rounded-xl overflow-hidden shrink-0 flex items-center justify-center font-serif text-lg text-secondary">
                      📦
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-light mt-0.5">
                        ${item.price} &times; {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping coordinates */}
          <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl shadow-sm">
            <h3 className="font-serif font-bold text-primary text-sm mb-3">Shipping Logistics</h3>
            <p className="text-sm font-bold text-gray-800 mb-1">{order.user?.name}</p>
            <p className="text-xs text-gray-600 font-light">{order.shippingAddress.address}</p>
            <p className="text-xs text-gray-600 font-light">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-xs text-gray-600 font-semibold mt-0.5">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Right column: Invoice summary */}
        <div className="bg-white border border-[#ECECEC] p-6 rounded-3xl h-fit flex flex-col gap-4 shadow-sm">
          <h3 className="font-serif font-bold text-primary text-sm border-b border-[#ECECEC] pb-3">Billing Summary</h3>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Payment Method</span>
            <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-xs text-gray-500 border-b border-[#ECECEC]/60 pb-3">
            <span>Payment Status</span>
            <span className={`font-semibold ${order.isPaid ? 'text-success' : 'text-error'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-850 font-black text-sm mt-2">
            <span>Total Cost</span>
            <span className="text-primary text-lg font-extrabold">${order.totalPrice.toFixed(2)}</span>
          </div>

          {order.paymentMethod === 'Cash on Delivery' && !order.isPaid && (
            <p className="text-[10px] text-[#8C7A5F] bg-[#FAF3E7] p-3 rounded-2xl border border-[#FAF3E7]/40 leading-relaxed font-light mt-2">
              <strong>COD Note:</strong> Settle payment in cash upon shipping receipt. The status updates to Paid after dispatch is confirmed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
