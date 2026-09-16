const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin dashboard summary metrics
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Admin list all orders
router.get('/', protect, adminOnly, getAllOrders);

// Order by ID (Customer owner or Admin)
router.get('/:id', protect, getOrderById);

// Admin update status
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
