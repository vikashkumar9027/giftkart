const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'giftnest_super_secret_jwt_key_2026_intermediate_internship', {
    expiresIn: '30d',
  });
};

// @desc    Register / Upgrade to Seller
// @route   POST /api/seller/register
// @access  Private
const registerSeller = async (req, res, next) => {
  try {
    const { storeName, gstin, city, state, pincode, phone } = req.body;

    if (!storeName || !city || !state || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide store name, city, state, 6-digit pincode, and contact phone number.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = 'seller';
    user.sellerProfile = {
      storeName: storeName.trim(),
      gstin: gstin ? gstin.trim() : `GSTIN-${Date.now().toString().slice(-6)}`,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      phone: phone.trim(),
      rating: 4.8,
      isVerified: true,
    };

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Congratulations! ${storeName} is now registered as a verified seller on GiftNest Marketplace.`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        sellerProfile: user.sellerProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Seller Dashboard Stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // 1. Get seller's products
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id price stock name');
    const productIds = sellerProducts.map((p) => p._id);

    // 2. Find orders containing seller's products
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // 3. Compute seller specific metrics
    let totalRevenue = 0;
    let unitsSold = 0;
    let pendingOrdersCount = 0;

    orders.forEach((order) => {
      const sellerItems = order.items.filter(
        (item) => item.product && productIds.some((pid) => pid.toString() === item.product.toString())
      );

      sellerItems.forEach((item) => {
        totalRevenue += item.price * item.quantity;
        unitsSold += item.quantity;
      });

      if (['Pending', 'Confirmed', 'Packed'].includes(order.status)) {
        pendingOrdersCount++;
      }
    });

    const topProducts = await Product.find({ seller: sellerId }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        unitsSold,
        totalUnitsSold: unitsSold,
        totalProducts: sellerProducts.length,
        activeListings: sellerProducts.length,
        ordersToDispatch: pendingOrdersCount,
        totalOrders: orders.length,
        pendingOrdersCount,
      },
      sellerProfile: req.user.sellerProfile,
      recentOrders: orders.slice(0, 5),
      topProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for logged in seller
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product by seller
// @route   POST /api/seller/products
// @access  Private/Seller
const createSellerProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      mrp,
      brand,
      description,
      stock,
      images,
      occasion,
      highlights,
      specifications,
      isFeatured,
    } = req.body;

    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product title, category, price, and description.',
      });
    }

    const calculatedMrp = mrp && Number(mrp) > Number(price) ? Number(mrp) : Math.round(Number(price) * 1.35);

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      mrp: calculatedMrp,
      brand: brand || req.user.sellerProfile?.storeName || 'Artisan Seller',
      seller: req.user._id,
      description,
      stock: stock !== undefined ? Number(stock) : 15,
      images: Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'],
      occasion: occasion || 'General',
      highlights: Array.isArray(highlights) ? highlights : ['100% Genuine Quality', 'Fast Indian Dispatch', 'NestAssured Verified'],
      specifications: specifications || {},
      isAssured: true,
      isFeatured: !!isFeatured,
    });

    const populated = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'name sellerProfile');

    res.status(201).json({
      success: true,
      message: 'Product listed successfully on GiftNest Marketplace!',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product by seller
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateSellerProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Ownership check
    if (
      product.seller &&
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit products from your own store.',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product by seller
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteSellerProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (
      product.seller &&
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only remove products from your own store.',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product removed from marketplace.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer orders for seller's products
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res, next) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map((p) => p._id);

    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSeller,
  getSellerDashboard,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
};
