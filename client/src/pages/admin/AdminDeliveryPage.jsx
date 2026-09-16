import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  User,
  Plus,
  ArrowRight,
  Filter,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import { formatDateTime, formatDate, formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PrintPackingSlipModal from '../../components/common/PrintPackingSlipModal';
import { useToast } from '../../components/common/Toast';

const carriers = ['FedEx Express', 'BlueDart Air', 'DHL Express', 'USPS Priority', 'Local Express'];

const AdminDeliveryPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [packingSlipModalOpen, setPackingSlipModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dispatch / Carrier update form
  const [dispatchForm, setDispatchForm] = useState({
    carrierName: 'FedEx Express',
    trackingNumber: '',
    agentName: 'Alex Vance',
    agentPhone: '+1 (555) 349-1029',
    vehicleType: 'Climate Controlled Van',
    estimatedDelivery: '',
    status: 'Shipped',
    milestoneNote: '',
  });

  // Custom milestone form
  const [milestoneForm, setMilestoneForm] = useState({
    title: 'Arrived at Regional Distribution Hub',
    description: 'Parcel scanned into local sorting conveyor.',
    location: 'San Francisco Hub',
    status: 'In Transit',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get(`/orders?limit=100${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`),
        api.get('/orders/dashboard/stats'),
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load delivery data:', err);
      showToast('Error loading delivery operations data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const openDispatchModal = (order) => {
    setSelectedOrder(order);
    const existingCarrier = order.deliveryDetails?.carrierName || 'FedEx Express';
    const existingTracking =
      order.deliveryDetails?.trackingNumber ||
      `FED-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100000 + Math.random() * 900000)}`;

    setDispatchForm({
      carrierName: existingCarrier,
      trackingNumber: existingTracking,
      agentName: order.deliveryDetails?.deliveryAgent?.name || 'Alex Vance',
      agentPhone: order.deliveryDetails?.deliveryAgent?.phone || '+1 (555) 349-1029',
      vehicleType: order.deliveryDetails?.deliveryAgent?.vehicleType || 'Climate Controlled Van',
      estimatedDelivery: order.deliveryDetails?.estimatedDelivery
        ? new Date(order.deliveryDetails.estimatedDelivery).toISOString().split('T')[0]
        : '',
      status: order.status === 'Pending' || order.status === 'Confirmed' ? 'Shipped' : order.status,
      milestoneNote: 'Handed over to carrier partner with secure packaging.',
    });
    setDispatchModalOpen(true);
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);

    try {
      const payload = {
        carrierName: dispatchForm.carrierName,
        trackingNumber: dispatchForm.trackingNumber.trim(),
        trackingUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `${dispatchForm.carrierName} ${dispatchForm.trackingNumber}`
        )}`,
        estimatedDelivery: dispatchForm.estimatedDelivery || undefined,
        deliveryAgent: {
          name: dispatchForm.agentName.trim(),
          phone: dispatchForm.agentPhone.trim(),
          vehicleType: dispatchForm.vehicleType.trim(),
        },
        status: dispatchForm.status,
        logMilestone: true,
        milestoneNote: dispatchForm.milestoneNote.trim(),
      };

      const res = await api.patch(`/orders/${selectedOrder._id}/delivery`, payload);
      if (res.data.success) {
        showToast(
          `Carrier assigned and status updated to "${dispatchForm.status}".`,
          'success'
        );
        setDispatchModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Dispatch update error:', err);
      showToast(err.response?.data?.message || 'Failed to update courier details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openMilestoneModal = (order) => {
    setSelectedOrder(order);
    setMilestoneForm({
      title: 'Package in Transit at Regional Hub',
      description: 'Scanned through sorting station. On track for delivery.',
      location: order.deliveryAddress?.city || 'Distribution Hub',
      status: order.status,
    });
    setMilestoneModalOpen(true);
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);

    try {
      const res = await api.post(`/orders/${selectedOrder._id}/timeline`, milestoneForm);
      if (res.data.success) {
        showToast('Milestone logged to delivery timeline.', 'success');
        setMilestoneModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Milestone submit error:', err);
      showToast('Failed to add milestone log', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openPackingSlip = (order) => {
    setSelectedOrder(order);
    setPackingSlipModalOpen(true);
  };

  const filteredOrders = orders.filter((ord) => {
    const q = search.toLowerCase();
    const matchesSearch =
      ord._id.toLowerCase().includes(q) ||
      ord.deliveryAddress?.fullName?.toLowerCase().includes(q) ||
      ord.deliveryAddress?.city?.toLowerCase().includes(q) ||
      ord.deliveryDetails?.trackingNumber?.toLowerCase().includes(q);

    const matchesCarrier =
      carrierFilter === 'all' || ord.deliveryDetails?.carrierName === carrierFilter;

    return matchesSearch && matchesCarrier;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Logistics & Fulfillment
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            Delivery Operations Portal
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Carrier assignments, live AWB tracking generation, milestone logging, and warehouse packing slips.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchData()}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-full transition-colors"
          >
            Refresh Logistics
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Pending Dispatch
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-stone-900 font-sans">
            {stats?.pendingDispatch ?? 0}
          </h3>
          <p className="text-[11px] text-stone-500">Orders ready for courier pickup</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              In Transit
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-stone-900 font-sans">
            {stats?.inTransit ?? 0}
          </h3>
          <p className="text-[11px] text-stone-500">Dispatched with partner carriers</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Delivered
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-stone-900 font-sans">
            {stats?.deliveredOrders ?? 0}
          </h3>
          <p className="text-[11px] text-stone-500">Gifts safely handed to recipients</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Recorded Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-stone-900 font-sans">
            {stats?.totalOrders ?? 0}
          </h3>
          <p className="text-[11px] text-stone-500">Lifetime gifting volume</p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AWB, Order ID, Recipient..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-stone-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-stone-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-stone-500">Carrier:</span>
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-stone-700 outline-none"
            >
              <option value="all">All Carriers</option>
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400 space-y-2">
            <Truck className="w-8 h-8 mx-auto text-stone-300" />
            <p>No delivery orders matching the criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">AWB & Order</th>
                  <th className="p-4">Carrier & Agent</th>
                  <th className="p-4">Recipient Destination</th>
                  <th className="p-4">Delivery Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-stone-900">
                        {ord.deliveryDetails?.trackingNumber || `ORDER-${ord._id.slice(-6)}`}
                      </p>
                      <p className="text-[11px] text-stone-400">Order Ref: #{ord._id.slice(-6)}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-stone-800 block">
                        {ord.deliveryDetails?.carrierName || 'Unassigned'}
                      </span>
                      <p className="text-[11px] text-stone-500">
                        Agent: {ord.deliveryDetails?.deliveryAgent?.name || 'Pending Dispatch'}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-stone-800">{ord.deliveryAddress?.fullName}</p>
                      <p className="text-[11px] text-stone-500">
                        {ord.deliveryAddress?.city}, {ord.deliveryAddress?.state}
                      </p>
                    </td>

                    <td className="p-4">
                      {ord.deliveryDate ? (
                        <span className="font-bold text-rose-700">
                          {formatDate(ord.deliveryDate)}
                        </span>
                      ) : (
                        <span className="text-stone-400">Standard Express</span>
                      )}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={ord.status} />
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => openDispatchModal(ord)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-[11px] transition-colors"
                        title="Update Carrier & AWB Details"
                      >
                        Assign / Dispatch
                      </button>

                      <button
                        onClick={() => openMilestoneModal(ord)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
                        title="Add Tracking Milestone"
                      >
                        + Milestone
                      </button>

                      <button
                        onClick={() => openPackingSlip(ord)}
                        className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-[11px] transition-colors inline-flex items-center space-x-1"
                        title="Print Packing & Fulfillment Slip"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispatch / Carrier Assignment Modal */}
      <Modal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        title="Assign Courier & Dispatch Parcel"
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Recipient:</span>
              <p className="font-bold text-stone-900">
                {selectedOrder.deliveryAddress?.fullName} — {selectedOrder.deliveryAddress?.city},{' '}
                {selectedOrder.deliveryAddress?.state}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Carrier Partner *</label>
                <select
                  value={dispatchForm.carrierName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, carrierName: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {carriers.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">AWB Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={dispatchForm.trackingNumber}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })}
                  placeholder="e.g. FED-8910-239102"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery Agent Name</label>
                <input
                  type="text"
                  value={dispatchForm.agentName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, agentName: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Agent Phone</label>
                <input
                  type="text"
                  value={dispatchForm.agentPhone}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, agentPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Vehicle Type</label>
                <input
                  type="text"
                  value={dispatchForm.vehicleType}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleType: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Update Status *</label>
                <select
                  value={dispatchForm.status}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Estimated Delivery Date</label>
                <input
                  type="date"
                  value={dispatchForm.estimatedDelivery}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, estimatedDelivery: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Milestone Log Note</label>
              <textarea
                rows={2}
                value={dispatchForm.milestoneNote}
                onChange={(e) => setDispatchForm({ ...dispatchForm, milestoneNote: e.target.value })}
                placeholder="Dispatched via carrier hub..."
                className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDispatchModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Confirm Dispatch'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Custom Milestone Modal */}
      <Modal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        title="Add Delivery Tracking Milestone"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleMilestoneSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Milestone Title *</label>
            <input
              type="text"
              required
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              placeholder="e.g. Scanned into Regional Sorting Hub"
              className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Location *</label>
            <input
              type="text"
              required
              value={milestoneForm.location}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, location: e.target.value })}
              placeholder="e.g. SFO Logistics Hub or Recipient City"
              className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Description / Note</label>
            <textarea
              rows={2}
              value={milestoneForm.description}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              placeholder="Additional transit information..."
              className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Associated Order Status</label>
            <select
              value={milestoneForm.status}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setMilestoneModalOpen(false)}
              className="px-5 py-2 rounded-full border border-stone-200 text-stone-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Log Milestone'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Packing Slip Print Modal */}
      <PrintPackingSlipModal
        isOpen={packingSlipModalOpen}
        onClose={() => setPackingSlipModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminDeliveryPage;
