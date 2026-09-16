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
  Printer,
  ExternalLink,
  CreditCard,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';
import PrintReceiptModal from '../../components/common/PrintReceiptModal';

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

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
  const trackingNumber = order.deliveryDetails?.trackingNumber || order._id;

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

          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={order.status} />

            <Link
              to={`/track?q=${trackingNumber}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Live</span>
            </Link>

            <button
              onClick={() => setShowReceiptModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Tracking Progress Bar */}
      {!isCancelled ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Gifting Dispatch & Shipment Tracker
            </h3>
            {order.deliveryDetails?.carrierName && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 flex items-center space-x-1.5 w-fit">
                <Truck className="w-3.5 h-3.5" />
                <span>Handled by <strong>{order.deliveryDetails.carrierName}</strong></span>
              </span>
            )}
          </div>

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

          {/* Courier & AWB Information Card */}
          {order.deliveryDetails?.trackingNumber && (
            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">AWB Tracking Number</span>
                <span className="text-xs font-mono font-bold text-stone-800 select-all">
                  {order.deliveryDetails.trackingNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Assigned Courier</span>
                <span className="text-xs font-bold text-stone-800">
                  {order.deliveryDetails.carrierName || 'GiftNest Express'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">Delivery Agent</span>
                <span className="text-xs font-medium text-stone-700">
                  {order.deliveryDetails.deliveryAgent?.name ? (
                    `${order.deliveryDetails.deliveryAgent.name} (${order.deliveryDetails.deliveryAgent.phone || 'Active'})`
                  ) : (
                    'Regional Courier Hub'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>This order has been cancelled. Any items reserved have been returned to stock.</span>
        </div>
      )}

      {/* Recipient, Packaging & Gift Message Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
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

        {/* Packaging Presentation */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
            <Box className="w-4 h-4" />
            <span>Packaging & Presentation</span>
          </div>
          <div className="text-xs space-y-2 text-stone-700">
            <div>
              <span className="text-stone-400 block text-[11px]">Gift Box Style:</span>
              <p className="font-bold text-stone-900 text-sm">
                {order.giftPackaging?.name || 'Standard Eco-Kraft Box'}
              </p>
            </div>
            {order.giftPackaging?.ribbonColor && (
              <div>
                <span className="text-stone-400 block text-[11px]">Ribbon Accent:</span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                  {order.giftPackaging.ribbonColor}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-100 text-stone-500 text-[11px]">
              Inspected & sealed by GiftNest Master Crafters.
            </div>
          </div>
        </div>

        {/* Handwritten Greeting Note */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs uppercase tracking-wider pb-2 border-b border-stone-100">
            <Heart className="w-4 h-4" />
            <span>Handwritten Card</span>
          </div>
          {(order.greetingCard?.message || order.giftMessage) ? (
            <div className="text-xs text-stone-700 space-y-2">
              <div className="italic bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100 leading-relaxed font-serif">
                "{order.greetingCard?.message || order.giftMessage}"
              </div>
              {order.greetingCard?.senderName && (
                <p className="text-[11px] text-stone-500 text-right font-semibold">
                  — {order.greetingCard.senderName}
                </p>
              )}
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
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                />
                <div className="space-y-1">
                  <Link
                    to={`/product/${item.product?._id || item.product}`}
                    className="text-sm font-bold text-stone-900 hover:text-rose-600 transition-colors font-serif block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-stone-400">
                    Unit Price: {formatCurrency(item.price)} • Quantity: {item.quantity}
                  </p>

                  {/* Customization Details if present */}
                  {item.customization && (item.customization.customText || item.customization.recipientName || item.customization.customPhotoUrl) && (
                    <div className="mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block">
                        Personalization Specs:
                      </span>
                      {item.customization.recipientName && (
                        <p className="text-stone-700">
                          For: <strong>{item.customization.recipientName}</strong>
                        </p>
                      )}
                      {item.customization.customText && (
                        <p className="text-stone-700">
                          Engraved Text: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-stone-200 text-rose-700 font-bold">{item.customization.customText}</span>
                        </p>
                      )}
                      {item.customization.customPhotoUrl && (
                        <div className="flex items-center space-x-2 pt-1">
                          <span className="text-stone-500">Custom Photo:</span>
                          <a
                            href={item.customization.customPhotoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 hover:underline inline-flex items-center text-[11px] font-semibold"
                          >
                            <span>View Uploaded Image</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-sm font-bold text-stone-900 font-sans">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing & Payment Summary */}
        <div className="pt-6 border-t border-stone-100 space-y-3 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Items Subtotal</span>
            <span className="font-bold text-stone-900">
              {formatCurrency(
                order.items?.reduce((acc, i) => acc + i.price * i.quantity, 0) || order.totalAmount
              )}
            </span>
          </div>
          {order.giftPackaging?.price > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>{order.giftPackaging.name}</span>
              <span className="font-bold text-stone-900">{formatCurrency(order.giftPackaging.price)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600">
            <span>Artisan Delivery & Handling</span>
            <span className="font-bold text-emerald-600">Complimentary</span>
          </div>

          {/* Payment Status Pill */}
          {order.paymentInfo && (
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-stone-800">
                  Payment Method: <strong>{order.paymentInfo.method || 'Online Payment'}</strong>
                </span>
                {order.paymentInfo.transactionId && (
                  <span className="text-stone-400 font-mono text-[11px]">
                    (Txn: #{order.paymentInfo.transactionId})
                  </span>
                )}
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {order.paymentInfo.status || 'Paid'}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
            <span>Total Paid</span>
            <span className="text-rose-600 text-xl font-serif">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <PrintReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        order={order}
      />
    </div>
  );
};

export default OrderDetailPage;
