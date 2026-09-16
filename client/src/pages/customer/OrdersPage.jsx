import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag, Truck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';

const OrdersPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError('Could not retrieve your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=orders" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">My Gifting Orders</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track and view detailed records of all surprises sent through GiftNest.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-full border border-rose-100"
        >
          Send Another Gift
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-rose-50 text-rose-800 p-6 rounded-3xl text-center border border-rose-200">
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900">
            You haven't placed any orders yet
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Ready to brighten someone's day? Explore our curated catalog of gift crates and hampers.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full shadow-md shadow-rose-200 transition-all"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Explore Gifting Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header bar */}
              <div className="bg-stone-50/80 px-6 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block font-sans">Order ID</span>
                    <span className="font-mono font-bold text-stone-800">#{order._id}</span>
                  </div>
                  <div className="hidden sm:block text-stone-300">|</div>
                  <div>
                    <span className="text-stone-400 block font-sans">Order Placed</span>
                    <span className="font-semibold text-stone-800">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 ml-1 text-stone-400" />
                  </Link>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Items preview */}
                <div className="md:col-span-2 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate font-serif">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery & Total */}
                <div className="border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1 text-xs">
                    <span className="text-rose-600 font-bold uppercase tracking-wider block text-[10px]">
                      Delivered To:
                    </span>
                    <p className="font-bold text-stone-800">{order.deliveryAddress?.fullName}</p>
                    <p className="text-stone-500 line-clamp-1">
                      {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-400 block">Total Amount</span>
                    <span className="text-lg font-extrabold text-stone-900 font-serif">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
