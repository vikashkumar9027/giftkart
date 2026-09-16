const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateDeliveryDetails,
  addDeliveryTimelineMilestone,
  processPayment,
  updatePaymentStatus,
  trackOrderByTrackingNumberOrId,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route: Track order by Tracking Number or Order ID (No login required)
router.get('/track/:trackingId', trackOrderByTrackingNumberOrId);

// Customer protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.post('/:id/pay', protect, processPayment);

// Admin dashboard summary metrics & delivery analytics
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Admin list all orders
router.get('/', protect, adminOnly, getAllOrders);

// Order by ID (Customer owner or Admin)
router.get('/:id', protect, getOrderById);

// Admin status & delivery management
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/delivery', protect, adminOnly, updateDeliveryDetails);
router.post('/:id/timeline', protect, adminOnly, addDeliveryTimelineMilestone);
router.patch('/:id/payment', protect, adminOnly, updatePaymentStatus);

module.exports = router;

