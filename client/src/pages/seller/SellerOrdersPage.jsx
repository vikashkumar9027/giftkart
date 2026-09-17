import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Package,
  Calendar,
  MapPin,
  ExternalLink,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';
import PrintPackingSlipModal from '../../components/common/PrintPackingSlipModal';

const SellerOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);

  const fetchSellerOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      showToast('Failed to load dispatch orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== 'all' && order.orderStatus.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchId = order._id.toLowerCase().includes(term);
      const matchCustomer = order.deliveryAddress?.fullName?.toLowerCase().includes(term);
      const matchCity = order.deliveryAddress?.city?.toLowerCase().includes(term);
      const matchAwb = order.delivery?.trackingNumber?.toLowerCase().includes(term);
      return matchId || matchCustomer || matchCity || matchAwb;
    }
    return true;
  });

  const getTabCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter((o) => o.orderStatus.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Order Fulfillment & Dispatch Queue
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor buyer orders, print Flipkart-style packing slips, and verify courier logistics.
          </p>
        </div>

        <button
          onClick={fetchSellerOrders}
          className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors self-start sm:self-auto shadow-xs"
        >
          Refresh Orders
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {['all', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((status) => {
            const count = getTabCount(status);
            const isSelected = activeTab.toLowerCase() === status.toLowerCase();
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{status === 'all' ? 'All Orders' : status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-800 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer, PIN..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Truck className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">No matching dispatch orders</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            There are currently no orders in this category for your seller account.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedOrderForPrint(order)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Packing Slip</span>
                  </button>

                  {order.delivery?.trackingNumber && (
                    <Link
                      to={`/track?awb=${order.delivery.trackingNumber}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track AWB</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Order Items & Destination Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items in this order */}
                <div className="lg:col-span-2 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Your Products to Pack:
                  </span>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between bg-stone-50/70 p-3 rounded-2xl border border-stone-100 text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-stone-800 block truncate max-w-[280px]">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </span>
                            {item.customization?.customText && (
                              <span className="text-[10px] text-rose-600 block mt-0.5">
                                ✎ Engraving: "{item.customization.customText}"
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="font-bold text-stone-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Delivery Carrier */}
                <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200/70 text-xs space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Shipment & Destination:
                  </span>
                  <div className="space-y-1 text-stone-700">
                    <p className="font-bold text-stone-900">
                      {order.deliveryAddress?.fullName}
                    </p>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {order.deliveryAddress?.address}, {order.deliveryAddress?.city},{' '}
                      {order.deliveryAddress?.state} - <strong>{order.deliveryAddress?.pincode}</strong>
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Phone: <span className="font-mono">{order.deliveryAddress?.phone}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Courier Partner:</span>
                      <span className="font-bold text-stone-800">
                        {order.delivery?.carrier || 'Ekart Logistics'}
                      </span>
                    </div>
                    {order.delivery?.trackingNumber && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">AWB Code:</span>
                        <span className="font-mono font-bold text-blue-700">
                          {order.delivery.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Packing Slip Modal */}
      {selectedOrderForPrint && (
        <PrintPackingSlipModal
          order={selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}
    </div>
  );
};

export default SellerOrdersPage;
