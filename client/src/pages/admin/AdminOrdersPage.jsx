import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  CheckCircle2,
  Calendar,
  Truck,
  Heart,
  AlertCircle,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'all'
          ? '/orders?limit=100'
          : `/orders?status=${statusFilter}&limit=100`;
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders in admin:', err);
      showToast('Error loading orders list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to "${newStatus}".`, 'success');

        // Update local orders list
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action & filter bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Order Operations & Fulfillment
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor incoming gifting requests, manage packaging timelines, and update dispatch statuses.
          </p>
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="text-xs font-semibold text-stone-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
            <p>No orders found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Placed By</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Date Placed</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status & Action</th>
                  <th className="p-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-stone-800">{order.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-stone-400">{order.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-stone-800">
                        {order.deliveryAddress?.fullName}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                      </p>
                    </td>
                    <td className="p-4 text-stone-500">{formatDateTime(order.createdAt)}</td>
                    <td className="p-4 font-bold text-stone-900 font-sans">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={statusUpdating}
                          className="text-[11px] bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 font-semibold text-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Order #${selectedOrder?._id || ''}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-stone-700">
            {/* Status Changer Header inside Modal */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-stone-400 block font-sans">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-600">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  disabled={statusUpdating}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipient & Customer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-rose-600 text-[11px] uppercase tracking-wider mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </div>
                <p className="font-bold text-stone-900">{selectedOrder.deliveryAddress?.fullName}</p>
                <p>{selectedOrder.deliveryAddress?.address}</p>
                <p>
                  {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
                </p>
                <p className="text-stone-500 pt-1">Phone: {selectedOrder.deliveryAddress?.phone}</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1">
                <span className="font-bold text-stone-400 text-[11px] uppercase tracking-wider block mb-1">
                  Placed By Customer
                </span>
                <p className="font-bold text-stone-900">{selectedOrder.user?.name}</p>
                <p className="text-stone-500">{selectedOrder.user?.email}</p>
                <p className="text-stone-400 pt-1">
                  Placed at: {formatDateTime(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Gift Note & Delivery Date */}
            {(selectedOrder.giftMessage || selectedOrder.deliveryDate) && (
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-2">
                {selectedOrder.deliveryDate && (
                  <div className="flex items-center space-x-2 text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>Target Delivery Date: <strong>{formatDate(selectedOrder.deliveryDate)}</strong></span>
                  </div>
                )}
                {selectedOrder.giftMessage && (
                  <div className="pt-2 border-t border-stone-200">
                    <div className="flex items-center space-x-1.5 text-rose-600 font-bold mb-1">
                      <Heart className="w-3 h-3" />
                      <span>Gift Card Inscription:</span>
                    </div>
                    <p className="italic text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                      "{selectedOrder.giftMessage}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Items table */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[11px]">
                Ordered Products
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl p-3 bg-stone-50">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover bg-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-stone-400 text-[11px]">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-3 border-t border-stone-100">
              <span>Total Order Value</span>
              <span className="text-rose-600 text-lg font-serif">
                {formatCurrency(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
