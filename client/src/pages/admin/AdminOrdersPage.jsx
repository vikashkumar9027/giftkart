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
  Printer,
  FileText,
  CreditCard,
  Box,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDateTime, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import PrintPackingSlipModal from '../../components/common/PrintPackingSlipModal';
import PrintReceiptModal from '../../components/common/PrintReceiptModal';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];

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

  const openSlipModal = (order) => {
    setSelectedOrder(order);
    setSlipModalOpen(true);
  };

  const openReceiptModal = (order) => {
    setSelectedOrder(order);
    setReceiptModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to "${newStatus}".`, 'success');

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

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    setPaymentUpdating(true);
    try {
      const res = await api.patch(`/orders/${orderId}/payment`, { status: newPaymentStatus });
      if (res.data.success) {
        showToast(`Payment status updated to "${newPaymentStatus}".`, 'success');

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  paymentInfo: {
                    ...(o.paymentInfo || {}),
                    status: newPaymentStatus,
                    paidAt: newPaymentStatus === 'Paid' ? new Date() : o.paymentInfo?.paidAt,
                  },
                }
              : o
          )
        );

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            paymentInfo: {
              ...(prev.paymentInfo || {}),
              status: newPaymentStatus,
              paidAt: newPaymentStatus === 'Paid' ? new Date() : prev.paymentInfo?.paidAt,
            },
          }));
        }
      }
    } catch (err) {
      console.error('Payment status update failed:', err);
      showToast(err.response?.data?.message || 'Failed to update payment status', 'error');
    } finally {
      setPaymentUpdating(false);
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
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openSlipModal(order)}
                          className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          title="Print Packing / Fulfillment Slip"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openReceiptModal(order)}
                          className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Print Tax Invoice / Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDetailsModal(order)}
                          className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
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
        maxWidth="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-stone-700">
            {/* Status & Payment Operations Bar */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-stone-400 block font-sans text-[10px] uppercase font-bold">Fulfillment</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div>
                  <span className="text-stone-400 block font-sans text-[10px] uppercase font-bold">Payment</span>
                  <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    {selectedOrder.paymentInfo?.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-stone-600 text-[11px]">Order:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    disabled={statusUpdating}
                    className="bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-bold text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-stone-600 text-[11px]">Payment:</span>
                  <select
                    value={selectedOrder.paymentInfo?.status || 'Pending'}
                    onChange={(e) => handlePaymentStatusChange(selectedOrder._id, e.target.value)}
                    disabled={paymentUpdating}
                    className="bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 font-bold text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {paymentStatuses.map((pst) => (
                      <option key={pst} value={pst}>
                        {pst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Courier & AWB Assignment Info (if any) */}
            {selectedOrder.deliveryDetails?.trackingNumber && (
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block">Courier Carrier</span>
                  <span className="font-bold text-stone-800 text-xs">{selectedOrder.deliveryDetails.carrierName || 'Regional Express'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block">AWB Tracking #</span>
                  <span className="font-mono font-bold text-stone-800 text-xs">{selectedOrder.deliveryDetails.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block">Agent</span>
                  <span className="font-semibold text-stone-700 text-xs">
                    {selectedOrder.deliveryDetails.deliveryAgent?.name || 'Assigned Courier'}
                  </span>
                </div>
              </div>
            )}

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
                  Customer & Payment
                </span>
                <p className="font-bold text-stone-900">{selectedOrder.user?.name}</p>
                <p className="text-stone-500">{selectedOrder.user?.email}</p>
                <div className="pt-2 text-[11px] text-stone-600 flex items-center space-x-2">
                  <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                  <span>Method: <strong>{selectedOrder.paymentInfo?.method || 'Card'}</strong></span>
                </div>
                {selectedOrder.paymentInfo?.transactionId && (
                  <p className="text-stone-400 text-[10px] font-mono">
                    Txn ID: {selectedOrder.paymentInfo.transactionId}
                  </p>
                )}
              </div>
            </div>

            {/* Packaging & Gift Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-stone-600 font-bold text-[11px] uppercase tracking-wider mb-1">
                  <Box className="w-3.5 h-3.5 text-rose-600" />
                  <span>Packaging Presentation</span>
                </div>
                <p className="font-bold text-stone-900">
                  {selectedOrder.giftPackaging?.name || 'Standard Eco-Kraft Box'}
                </p>
                {selectedOrder.giftPackaging?.ribbonColor && (
                  <p className="text-stone-600">
                    Ribbon: <strong className="text-rose-700">{selectedOrder.giftPackaging.ribbonColor}</strong>
                  </p>
                )}
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-[11px] uppercase tracking-wider mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Handwritten Card Message</span>
                </div>
                {(selectedOrder.greetingCard?.message || selectedOrder.giftMessage) ? (
                  <p className="italic text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                    "{selectedOrder.greetingCard?.message || selectedOrder.giftMessage}"
                  </p>
                ) : (
                  <p className="text-stone-400 italic">No greeting card requested.</p>
                )}
              </div>
            </div>

            {/* Items table */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[11px]">
                Ordered Products & Personalization Specs
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl p-3 bg-stone-50">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-200 shrink-0 mt-0.5"
                      />
                      <div className="space-y-1">
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-stone-400 text-[11px]">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        {item.customization && (item.customization.customText || item.customization.recipientName || item.customization.customPhotoUrl) && (
                          <div className="text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-stone-200 space-y-0.5 mt-1">
                            {item.customization.recipientName && (
                              <p className="text-stone-700">For: <strong>{item.customization.recipientName}</strong></p>
                            )}
                            {item.customization.customText && (
                              <p className="text-stone-700">Engraved: <span className="font-mono text-rose-700 font-bold">"{item.customization.customText}"</span></p>
                            )}
                            {item.customization.customPhotoUrl && (
                              <a
                                href={item.customization.customPhotoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-600 hover:underline inline-flex items-center text-[10px] font-bold"
                              >
                                View Custom Photo Plaque <ExternalLink className="w-2.5 h-2.5 ml-1" />
                              </a>
                            )}
                          </div>
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

            {/* Total & Action Print Footer */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-stone-400 block text-[11px]">Total Order Value</span>
                <span className="text-rose-600 text-xl font-serif font-bold">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openSlipModal(selectedOrder)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>Packing Slip</span>
                </button>
                <button
                  onClick={() => openReceiptModal(selectedOrder)}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-300" />
                  <span>Tax Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Printable Modals */}
      {selectedOrder && (
        <>
          <PrintPackingSlipModal
            isOpen={slipModalOpen}
            onClose={() => setSlipModalOpen(false)}
            order={selectedOrder}
          />
          <PrintReceiptModal
            isOpen={receiptModalOpen}
            onClose={() => setReceiptModalOpen(false)}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
