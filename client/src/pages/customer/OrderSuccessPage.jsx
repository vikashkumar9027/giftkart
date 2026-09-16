import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, Calendar, Truck, Heart } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load confirmed order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-lg text-center space-y-8 animate-fade-in">
        {/* Celebration Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100">
            Order Confirmed & Received
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Thank You for Gifting with GiftNest!
          </h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Your thoughtful surprise has been recorded. Our artisan team is already preparing the packaging.
          </p>
        </div>

        {/* Order ID Banner */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div>
            <span className="text-xs text-stone-400 block font-sans">Order Reference ID</span>
            <span className="text-base sm:text-lg font-mono font-bold text-stone-800">
              #{order?._id || id}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {order && <StatusBadge status={order.status} />}
          </div>
        </div>

        {/* Order Items & Recipient Summary */}
        {order && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-2">
            {/* Delivery Recipient Box */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Recipient & Shipping</span>
              </div>
              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-900 text-sm">{order.deliveryAddress?.fullName}</p>
                <p>{order.deliveryAddress?.address}</p>
                <p>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                </p>
                <p className="text-stone-400">Phone: {order.deliveryAddress?.phone}</p>
              </div>

              {order.deliveryDate && (
                <div className="pt-2 border-t border-stone-200 flex items-center space-x-2 text-xs text-stone-700">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Delivery Date: <strong>{formatDate(order.deliveryDate)}</strong></span>
                </div>
              )}

              {order.giftMessage && (
                <div className="pt-2 border-t border-stone-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-rose-600">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Greeting Note:</span>
                  </div>
                  <p className="text-xs italic text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200">
                    "{order.giftMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* Items Summary Box */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>Gift Items Summary</span>
              </div>
              <div className="space-y-3 divide-y divide-stone-200/60 max-h-48 overflow-y-auto pr-1">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 pt-2 first:pt-0 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover bg-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-stone-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-rose-600 font-serif text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-stone-100">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>View All My Orders</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
