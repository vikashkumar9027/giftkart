const express = require('express');
const router = express.Router();
const {
  registerSeller,
  getSellerDashboard,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
} = require('../controllers/sellerController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

// Public/Buyer with login can register/upgrade as seller
router.post('/register', protect, registerSeller);

// Seller Protected Routes
router.get('/dashboard', protect, sellerOnly, getSellerDashboard);
router.get('/products', protect, sellerOnly, getSellerProducts);
router.post('/products', protect, sellerOnly, createSellerProduct);
router.put('/products/:id', protect, sellerOnly, updateSellerProduct);
router.delete('/products/:id', protect, sellerOnly, deleteSellerProduct);
router.get('/orders', protect, sellerOnly, getSellerOrders);

module.exports = router;
