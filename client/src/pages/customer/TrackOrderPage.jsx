import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Package,
  User,
  Phone,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Gift,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { formatDateTime, formatDate } from '../../utils/formatters';

const carrierBadges = {
  FedEx: { color: 'bg-purple-50 text-purple-800 border-purple-200', tag: 'FedEx Express' },
  BlueDart: { color: 'bg-blue-50 text-blue-800 border-blue-200', tag: 'BlueDart Air' },
  DHL: { color: 'bg-amber-50 text-amber-900 border-amber-300', tag: 'DHL Express' },
  USPS: { color: 'bg-sky-50 text-sky-800 border-sky-200', tag: 'USPS Priority' },
  'Local Express': { color: 'bg-emerald-50 text-emerald-800 border-emerald-200', tag: 'Local Fleet' },
};

const statusOrder = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const TrackOrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (searchKey) => {
    if (!searchKey || !searchKey.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/orders/track/${encodeURIComponent(searchKey.trim())}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError(
        err.response?.data?.message ||
          'No shipment found matching the provided reference. Please check your AWB tracking number or Order ID.'
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      fetchTracking(query.trim());
    }
  };

  // Find progress percentage
  const currentStatusIndex = order ? statusOrder.indexOf(order.status) : 0;
  const progressPercent = Math.max(
    10,
    Math.min(100, Math.round(((currentStatusIndex + 1) / statusOrder.length) * 100))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
          <Truck className="w-3.5 h-3.5" />
          <span>Live Courier Dispatch & AWB Fast-Track</span>
        </div>
        <h1 className="text-4xl font-serif font-bold text-stone-900">
          Track Your Gift Shipment
        </h1>
        <p className="text-stone-500 text-sm">
          Enter your Order ID (e.g. #6aaa...) or Courier AWB Tracking Number to view real-time transit milestones.
        </p>
      </div>

      {/* Tracking Input Bar */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-stone-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter AWB (e.g. FED-1029-482019) or Order ID"
              className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Track Package</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Button Suggestions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-stone-400">
            Try Demo Lookups:
          </span>
          <button
            type="button"
            onClick={() => {
              setQuery('FED-');
              fetchTracking('FED-');
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[11px] font-mono text-stone-700"
          >
            FedEx Express
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('BLU-');
              fetchTracking('BLU-');
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[11px] font-mono text-stone-700"
          >
            BlueDart Air
          </button>
          <Link
            to="/orders"
            className="ml-auto text-[11px] font-bold text-rose-600 hover:underline"
          >
            My Orders →
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-2xl mx-auto bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Shipment Results Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden animate-fade-in space-y-8 p-6 sm:p-10">
          {/* Top Status & Carrier Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  AWB Tracking Number
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Live Dispatch
                </span>
              </div>
              <h2 className="text-2xl font-mono font-extrabold text-stone-900 mt-1">
                {order.deliveryDetails?.trackingNumber || `ORDER-${order._id?.slice(-8)}`}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Carrier Partner:{' '}
                <strong className="text-stone-800 font-bold">
                  {order.deliveryDetails?.carrierName || 'Standard Express'}
                </strong>
              </p>
            </div>

            <div className="flex flex-col sm:items-end space-y-1">
              <span className="text-xs text-stone-400">Current Milestone Status</span>
              <span className="text-sm font-bold text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 font-serif">
                {order.status}
              </span>
            </div>
          </div>

          {/* Visual Milestone Progress Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
              <span>Order Received</span>
              <span>Packed & Sealed</span>
              <span>In Transit</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Grid: Delivery Agent & Estimated Arrival */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
              <div className="flex items-center space-x-2 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Estimated Arrival</span>
              </div>
              <p className="text-base font-bold font-serif text-stone-900">
                {order.deliveryDetails?.estimatedDelivery
                  ? formatDate(order.deliveryDetails.estimatedDelivery)
                  : 'Arriving in 2-3 Business Days'}
              </p>
              <p className="text-[11px] text-stone-500">Express climate-controlled shipment</p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
              <div className="flex items-center space-x-2 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Courier Agent</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                {order.deliveryDetails?.deliveryAgent?.name || 'Local Express Dispatcher'}
              </p>
              <p className="text-[11px] text-stone-500">
                {order.deliveryDetails?.deliveryAgent?.vehicleType || 'Delivery Van'}
              </p>
              {order.deliveryDetails?.deliveryAgent?.phone && (
                <p className="text-[11px] font-mono text-stone-600">
                  Contact: {order.deliveryDetails.deliveryAgent.phone}
                </p>
              )}
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
              <div className="flex items-center space-x-2 text-rose-600 text-[11px] font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Delivery Destination</span>
              </div>
              <p className="text-sm font-bold text-stone-900">
                {order.deliveryAddress?.fullName}
              </p>
              <p className="text-[11px] text-stone-600">
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}
              </p>
              <p className="text-[10px] text-stone-400">Sanitized for public privacy</p>
            </div>
          </div>

          {/* Milestone Event Logs Timeline */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Detailed Event History
            </h3>

            {order.deliveryDetails?.timeline && order.deliveryDetails.timeline.length > 0 ? (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-rose-200">
                {order.deliveryDetails.timeline
                  .slice()
                  .reverse()
                  .map((evt, idx) => (
                    <div key={idx} className="relative space-y-1 text-xs">
                      {/* Dot */}
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                          idx === 0 ? 'bg-rose-600 ring-4 ring-rose-100' : 'bg-stone-400'
                        }`}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{evt.title}</span>
                        <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                          {formatDateTime(evt.timestamp)}
                        </span>
                        {evt.location && (
                          <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            📍 {evt.location}
                          </span>
                        )}
                      </div>
                      {evt.description && (
                        <p className="text-stone-600 leading-relaxed max-w-xl">{evt.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-2xl text-xs text-stone-500">
                Package information recorded. Courier events will populate once parcel is dispatched.
              </div>
            )}
          </div>

          {/* Items Preview */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
              Included In This Parcel ({order.items?.length || 0} Gifts)
            </span>
            <div className="flex flex-wrap gap-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-bold text-stone-800 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
