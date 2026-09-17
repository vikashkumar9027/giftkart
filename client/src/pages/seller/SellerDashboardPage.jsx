import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Truck,
  IndianRupee,
  Plus,
  ArrowUpRight,
  Store,
  ShieldCheck,
  Star,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/seller/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load seller dashboard:', err);
        setError('Failed to load merchant metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-rose-800 text-sm">
        {error || 'Unable to retrieve seller statistics.'}
      </div>
    );
  }

  const { stats, recentOrders, topProducts } = data;
  const store = user?.sellerProfile || {};

  return (
    <div className="space-y-8">
      {/* Top Banner / Store Identity Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-xs font-bold px-3 py-0.5 rounded-full">
              Flipkart-Style Verified Seller
            </span>
            <span className="text-amber-400 text-xs font-bold flex items-center">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
              {store.rating || 4.8} / 5.0 Rating
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            {store.storeName || user.name}'s Seller Hub
          </h1>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            GSTIN: <span className="font-mono text-white">{store.gstin || '29AABCU9603R1ZM'}</span> • Operating from {store.city || 'Bengaluru'}, {store.state || 'Karnataka'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/seller/products"
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/shop"
            target="_blank"
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center space-x-2"
          >
            <span>Live Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {formatCurrency(stats.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              7-Day automated settlement
            </span>
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live Listings</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-stone-400 block mt-1">
              Items published in catalog
            </span>
          </div>
        </div>

        {/* Card 3: Orders to Dispatch */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Dispatch</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">
              {stats.ordersToDispatch}
            </span>
            <span className="text-[11px] text-stone-400 block mt-1">
              Requires packing &amp; carrier handover
            </span>
          </div>
        </div>

        {/* Card 4: Total Units Sold */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Units Sold</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {stats.totalUnitsSold || 0}
            </span>
            <span className="text-[11px] text-stone-400 block mt-1">
              Delivered across India
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Orders Queue & Catalog Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders to Dispatch (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Recent Orders Involving Your Products
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Orders placed through GiftNest containing your store's items
              </p>
            </div>
            <Link
              to="/seller/orders"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-400">No orders received yet. Keep your listings stocked!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Recipient & City</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-stone-800">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-stone-900">
                          {order.deliveryAddress?.fullName || 'Customer'}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                        </div>
                      </td>
                      <td className="py-3.5 text-stone-500">{formatDate(order.createdAt)}</td>
                      <td className="py-3.5 font-bold text-stone-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products / Inventory (1 Col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Your Catalog
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">Top performing items</p>
            </div>
            <Link
              to="/seller/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No products added yet.
              </div>
            ) : (
              topProducts.map((prod) => (
                <div key={prod._id} className="flex items-center space-x-3.5">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 truncate text-xs">{prod.name}</h3>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px]">
                      <span className="font-bold text-stone-800">{formatCurrency(prod.price)}</span>
                      <span className="text-stone-400">• Stock: {prod.stock}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link
              to="/seller/products"
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Product</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
