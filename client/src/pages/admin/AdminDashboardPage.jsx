import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Clock,
  Eye,
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/orders/dashboard/stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, recentOrders, lowStockProducts } = data || {
    stats: { totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalCategories: 0 },
    recentOrders: [],
    lowStockProducts: [],
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            Store Performance & Catalog Overview
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time counts for inventory, customer orders, and content assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            View Orders
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 mr-1.5" />
            Categories
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="rose"
          subtitle="Active gifting catalog"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
          subtitle="Processed & recorded"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="emerald"
          subtitle="Registered accounts"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={FolderTree}
          color="amber"
          subtitle="Occasions & collections"
        />
      </div>

      {/* Main Grid: Recent Orders and Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-rose-600" />
              <h3 className="font-serif font-bold text-lg text-stone-900">Recent Customer Orders</h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-stone-400 py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-stone-900">
                        #{ord._id.slice(-6)}
                      </td>
                      <td className="py-3 font-semibold text-stone-800">{ord.user?.name || 'Customer'}</td>
                      <td className="py-3 text-stone-400">{formatDateTime(ord.createdAt)}</td>
                      <td className="py-3 font-bold text-stone-900 font-sans">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={ord.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product Stock Overview / Alerts (1 col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-stone-900">Low Stock Overview</h3>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Items that are running low (stock count ≤ 5) and may require restocking soon.
          </p>

          {lowStockProducts.length === 0 ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-semibold text-center border border-emerald-100">
              ✨ All products currently have healthy inventory levels!
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs"
                >
                  <div className="truncate mr-3">
                    <p className="font-bold text-stone-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-stone-500">{p.category?.name || 'Gift'}</p>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/admin/products"
            className="block text-center py-2.5 px-4 bg-stone-100 hover:bg-stone-200 rounded-2xl text-xs font-bold text-stone-700 transition-colors"
          >
            Manage Product Inventory →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
