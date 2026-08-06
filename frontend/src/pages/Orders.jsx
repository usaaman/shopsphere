import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8 border-b border-[#ECECEC] pb-4">
        <div>
          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">Verdora Purchases</span>
          <h1 className="text-3xl font-serif font-bold text-primary mt-1">My Orders</h1>
        </div>
        <Link to="/profile" className="text-xs font-semibold text-primary hover:underline">
          Account Settings &rarr;
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-xs font-light">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#ECECEC] rounded-3xl p-12 text-center shadow-sm">
          <span className="text-4xl">📦</span>
          <h2 className="font-serif font-bold text-primary mt-4 mb-2">No orders placed yet</h2>
          <p className="text-xs text-gray-500 mb-6 font-light">You have not completed any order transactions yet.</p>
          <Link to="/shop" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full">
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-[#ECECEC]/60 rounded-3xl p-5 hover:border-primary/15 transition bg-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-serif font-bold text-gray-800 text-base">Order #{order._id.slice(-6)}</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    order.isPaid ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    order.isDelivered ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-750'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-3.5 sm:pt-0">
                <span className="font-extrabold text-gray-900 text-base">${order.totalPrice.toFixed(2)}</span>
                <Link
                  to={`/orders/${order._id}`}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest transition"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;