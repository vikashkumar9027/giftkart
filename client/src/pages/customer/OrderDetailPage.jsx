import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Calendar,
  Heart,
  Package,
  CheckCircle2,
  Clock,
  Box,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        setError('Order not found or unauthorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">{error || 'Order Not Found'}</h2>
        <p className="text-xs text-stone-500">
          We couldn't retrieve the details for this order. It might belong to another account or does not exist.
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center px-5 py-2.5 bg-rose-600 text-white rounded-full text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
      </div>
    );
  }

  // Calculate timeline progress index
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button & Title */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Orders History
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-xs text-stone-400 font-sans">Order Details</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 font-mono">
              #{order._id}
            </h1>
            <p className="text-xs text-stone-500 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Status Tracking Progress Bar */}
      {!isCancelled ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
            Gifting Dispatch Tracker
          </h3>
          <div className="grid grid-cols-5 gap-2 relative">
            {statusSteps.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-200 font-bold'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium ${
                      isCurrent
                        ? 'text-rose-600 font-bold'
                        : isCompleted
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>This order has been cancelled. Any items reserved have been returned to stock.</span>
        </div>
      )}

      {/* Recipient & Gift Message Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
            <Truck className="w-4 h-4" />
            <span>Delivery Recipient</span>
          </div>
          <div className="text-xs text-stone-600 space-y-1.5 leading-relaxed">
            <p className="text-sm font-bold text-stone-900">{order.deliveryAddress?.fullName}</p>
            <p>{order.deliveryAddress?.address}</p>
            <p>
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
            </p>
            <p className="text-stone-500 pt-1">Phone: {order.deliveryAddress?.phone}</p>
          </div>

          {order.deliveryDate && (
            <div className="pt-2 border-t border-stone-100 flex items-center space-x-2 text-xs text-stone-700">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Requested Date: <strong>{formatDate(order.deliveryDate)}</strong></span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
            <Heart className="w-4 h-4" />
            <span>Personalized Card Note</span>
          </div>
          {order.giftMessage ? (
            <div className="text-xs text-stone-700 italic bg-rose-50/60 p-4 rounded-2xl border border-rose-100 leading-relaxed">
              "{order.giftMessage}"
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">No custom greeting card requested.</p>
          )}
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
          Items in this Order
        </h3>

        <div className="divide-y divide-stone-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                />
                <div>
                  <Link
                    to={`/product/${item.product?._id || item.product}`}
                    className="text-sm font-bold text-stone-900 hover:text-rose-600 transition-colors font-serif"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Unit Price: {formatCurrency(item.price)} • Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-stone-900 font-sans">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-6 border-t border-stone-100 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-stone-900">
              {formatCurrency(
                order.items?.reduce((acc, i) => acc + i.price * i.quantity, 0) || order.totalAmount
              )}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Artisan Delivery & Handling</span>
            <span className="font-bold text-emerald-600">Included</span>
          </div>
          <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
            <span>Total Paid / Due</span>
            <span className="text-rose-600 text-xl font-serif">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
