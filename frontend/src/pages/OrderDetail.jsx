import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/api';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

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
      showToast('Payment simulated successfully', 'success');
      fetchOrder();
    } catch (err) {
      showToast(err.response?.data?.message || 'Payment simulation failed', 'danger');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-text-secondary text-sm">Loading order details...</p>;
  if (error) return <p className="text-center mt-10 text-danger text-sm">{error}</p>;
  if (!order) return <p className="text-center mt-10 text-text-secondary text-sm">Order not found</p>;

  // Progress steps
  const steps = [
    { label: 'Placed', active: true, date: order.createdAt },
    { label: 'Paid', active: order.isPaid, date: order.paidAt },
    { label: 'Dispatched', active: order.isDelivered, date: order.deliveredAt },
    { label: 'Delivered', active: order.isDelivered, date: order.deliveredAt },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 print:p-0 print:m-0">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 print:hidden">
        <div>
          <Link to="/profile" className="text-xs font-semibold text-primary-start hover:underline">
            &larr; Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-2">Order #{order._id.slice(-6)}</h1>
          <p className="text-xs text-text-secondary font-light mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Invoice Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="border border-border-light bg-white hover:bg-bg-soft text-text-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm"
          >
            🖨️ Download Invoice
          </button>

          {!order.isPaid && order.paymentMethod === 'Card' && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handlePayOrder}
              disabled={paying}
              className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-95 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition disabled:opacity-50 shadow-sm"
            >
              {paying ? 'Processing...' : 'Simulate Payment'}
            </motion.button>
          )}
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="hidden print:flex flex-col gap-2 pb-6 border-b border-border-light mb-8">
        <h1 className="text-2xl font-bold text-text-primary">SHOPSPHERE INVOICE</h1>
        <p className="text-xs text-text-secondary">Order Reference ID: #{order._id}</p>
        <p className="text-xs text-text-secondary">Receipt Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white border border-border-light p-8 rounded-2xl mb-8 shadow-sm print:hidden">
        <h3 className="font-bold text-text-primary text-xs mb-6 uppercase tracking-wider">Delivery Progress</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center relative gap-6 sm:gap-4">
          <div className="hidden sm:block absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-gray-100 -z-10" />
          <div
            className="hidden sm:block absolute top-[18px] left-[5%] h-0.5 bg-gradient-to-r from-primary-start to-primary-end -z-10 transition-all duration-300"
            style={{
              width: `${order.isDelivered ? '90%' : order.isPaid ? '60%' : '30%'
                }`,
            }}
          />

          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-grow sm:flex-grow-0 z-10 w-full sm:w-auto">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 ${step.active
                    ? 'bg-primary-start border-primary-start text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-300'
                  }`}
              >
                {step.active ? '✓' : idx + 1}
              </div>
              <div className="text-left sm:text-center">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${step.active ? 'text-text-primary' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.active && step.date && (
                  <p className="text-[9px] text-text-secondary mt-0.5 font-light">
                    {new Date(step.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-border-light p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-text-primary text-xs mb-4 uppercase tracking-wider">Items Summary</h3>
            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-4 py-2 border-b border-border-light last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bg-soft rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-lg">
                      📦
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary text-xs line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-text-secondary font-light mt-0.5">
                        ${item.price} &times; {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-text-primary text-xs">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping coordinates */}
          <div className="bg-white border border-border-light p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-text-primary text-xs mb-3 uppercase tracking-wider">Shipping Coordinates</h3>
            <p className="text-xs font-bold text-text-primary mb-1">{order.user?.name}</p>
            <p className="text-xs text-text-secondary font-light">{order.shippingAddress.address}</p>
            <p className="text-xs text-text-secondary font-light">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-xs text-text-primary font-semibold mt-0.5">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Right Summary */}
        <div className="bg-white border border-border-light p-6 rounded-2xl h-fit flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-text-primary text-xs border-b border-border-light pb-3 uppercase tracking-wider">Billing Invoice</h3>

          <div className="flex justify-between text-xs text-text-secondary">
            <span>Payment Method</span>
            <span className="font-semibold text-text-primary">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between text-xs text-text-secondary border-b border-border-light pb-3">
            <span>Status</span>
            <span className={`font-semibold ${order.isPaid ? 'text-success' : 'text-danger'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <div className="flex justify-between items-center text-text-primary font-black text-sm mt-2">
            <span>Total Cost</span>
            <span className="text-primary-start text-base font-extrabold">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
