const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper to generate tracking number
const generateTrackingNumber = (carrier = 'GN') => {
  const prefix = carrier.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'EXP');
  const rand1 = Math.floor(1000 + Math.random() * 9000);
  const rand2 = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${rand1}-${rand2}`;
};

// Helper to generate transaction ID
const generateTransactionId = (method = 'CARD') => {
  const code = (method || 'TXN').substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().slice(-7);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${code}_${timestamp}_${rand}`;
};

// @desc    Create a new order with gift packaging, customization, & payment info
// @route   POST /api/orders
// @access  Private (Logged in customer)
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryAddress,
      giftMessage,
      deliveryDate,
      giftPackaging,
      greetingCard,
      paymentInfo,
    } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before checking out.',
      });
    }

    // Validate delivery address
    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery details (Recipient name, phone, address, city, state, pincode).',
      });
    }

    // Verify each product and its stock in MongoDB
    let calculatedItemsTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sorry, insufficient stock for "${product.name}". Only ${product.stock} available.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedItemsTotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: (product.images && product.images[0]) || item.image || '',
        customization: {
          recipientName: item.customization?.recipientName || '',
          customText: item.customization?.customText || '',
          customPhotoUrl: item.customization?.customPhotoUrl || '',
          occasionBadge: item.customization?.occasionBadge || product.occasion || '',
        },
        packaging: {
          name: item.packaging?.name || '',
          price: Number(item.packaging?.price) || 0,
          ribbonColor: item.packaging?.ribbonColor || '',
        },
      });
    }

    // Deduct stock for all ordered products
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculate packaging fee & shipping fee
    const packagingFee = Number(giftPackaging?.price) || 0;
    const shippingFee = calculatedItemsTotal >= 50 ? 0 : 7.99;
    const grandTotal = calculatedItemsTotal + packagingFee + shippingFee;

    // Determine initial payment status and transaction ID
    const paymentMethod = paymentInfo?.method || 'card';
    const isPaidOnline = paymentMethod !== 'cod' && (paymentInfo?.status === 'Paid' || paymentInfo?.paid);
    const initialPaymentStatus = isPaidOnline ? 'Paid' : 'Pending';
    const transactionId = paymentInfo?.transactionId || (isPaidOnline ? generateTransactionId(paymentMethod) : '');

    // Setup initial delivery details
    const carrier = 'FedEx Express';
    const trackingNo = generateTrackingNumber(carrier);
    const estimatedArrival = deliveryDate
      ? new Date(deliveryDate)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const initialTimeline = [
      {
        status: 'Pending',
        title: 'Order Registered in Gifting Studio',
        description: 'Surprise order details received. Preparing artisanal materials & packaging crate.',
        location: 'GiftNest Central Fulfillment Hub',
        timestamp: new Date(),
      },
    ];

    if (isPaidOnline) {
      initialTimeline.push({
        status: 'Confirmed',
        title: `Payment Verified (${paymentMethod.toUpperCase()})`,
        description: `Secure transaction confirmed. Transaction Ref: #${transactionId}`,
        location: 'Payment Gateway Node',
        timestamp: new Date(),
      });
    }

    const orderStatus = isPaidOnline ? 'Confirmed' : 'Pending';

    // Create the Order
    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName.trim(),
        phone: deliveryAddress.phone.trim(),
        address: deliveryAddress.address.trim(),
        city: deliveryAddress.city.trim(),
        state: deliveryAddress.state.trim(),
        pincode: deliveryAddress.pincode.trim(),
      },
      giftPackaging: {
        boxType: giftPackaging?.boxType || 'classic',
        name: giftPackaging?.name || 'Classic Eco-Kraft Box',
        price: packagingFee,
        ribbonColor: giftPackaging?.ribbonColor || 'Crimson Velvet',
      },
      greetingCard: {
        theme: greetingCard?.theme || 'Birthday Elegance',
        message: (greetingCard?.message || giftMessage || '').trim(),
        senderName: (greetingCard?.senderName || req.user.name || '').trim(),
        fontStyle: greetingCard?.fontStyle || 'handwritten',
      },
      giftMessage: (giftMessage || greetingCard?.message || '').trim(),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      deliveryDetails: {
        carrierName: carrier,
        trackingNumber: trackingNo,
        trackingUrl: `https://www.fedex.com/fedextrack/?trknbr=${trackingNo}`,
        estimatedDelivery: estimatedArrival,
        deliveryAgent: {
          name: 'Alex Vance',
          phone: '+1 (555) 349-1029',
          vehicleType: 'Climate Controlled Delivery Van',
        },
        timeline: initialTimeline,
      },
      paymentInfo: {
        method: paymentMethod,
        status: initialPaymentStatus,
        transactionId: transactionId,
        paidAt: isPaidOnline ? new Date() : undefined,
        amountPaid: isPaidOnline ? grandTotal : 0,
        details: paymentInfo?.details || {},
      },
      totalAmount: grandTotal,
      status: orderStatus,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/my-orders
// @access  Private (Logged in customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by ID
// @route   GET /api/orders/:id
// @access  Private (Owner customer or Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Privacy guard: Customer can only view their OWN order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this order.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Public Track Order by Tracking Number or Order ID
// @route   GET /api/orders/track/:trackingId
// @access  Public (No login required)
const trackOrderByTrackingNumberOrId = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an Order ID or Tracking Number to track.',
      });
    }

    const query = [
      { 'deliveryDetails.trackingNumber': { $regex: new RegExp(`^${trackingId.trim()}$`, 'i') } },
    ];

    // If trackingId matches valid MongoDB ObjectId format, search by _id too
    if (/^[0-9a-fA-F]{24}$/.test(trackingId.trim())) {
      query.push({ _id: trackingId.trim() });
    }

    const order = await Order.findOne({ $or: query })
      .select('status deliveryDetails items deliveryAddress createdAt giftPackaging greetingCard totalAmount')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No shipment or order found matching the provided reference.',
      });
    }

    // Mask sensitive address details for public privacy
    const sanitizedDeliveryAddress = {
      fullName: order.deliveryAddress?.fullName || 'Recipient',
      city: order.deliveryAddress?.city || '',
      state: order.deliveryAddress?.state || '',
      pincode: order.deliveryAddress?.pincode ? `${order.deliveryAddress.pincode.slice(0, 2)}***` : '',
    };

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        status: order.status,
        createdAt: order.createdAt,
        deliveryDetails: order.deliveryDetails,
        deliveryAddress: sanitizedDeliveryAddress,
        giftPackaging: order.giftPackaging,
        itemsCount: order.items?.length || 0,
        items: order.items?.map((i) => ({
          name: i.name,
          image: i.image,
          quantity: i.quantity,
          customization: i.customization,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin CMS)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, carrier, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (carrier && carrier !== 'all') {
      query['deliveryDetails.carrierName'] = carrier;
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNumber - 1) * pageSize;

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / pageSize) || 1;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages,
      currentPage: pageNumber,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status with automatic delivery milestone logs (Admin CMS)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, location } = req.body;
    const validStatuses = [
      'Pending',
      'Confirmed',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // If order is cancelled, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Milestone descriptions for automated logging
    const milestoneDescriptions = {
      Confirmed: {
        title: 'Order Confirmed & Approved',
        description: note || 'Order details validated. Sent to artisan fulfillment workspace.',
        location: location || 'Fulfillment Operations',
      },
      Packed: {
        title: 'Gift Packed with Selected Packaging',
        description: note || `Packaged in ${order.giftPackaging?.name || 'artisan box'} with delicate ribbon seal.`,
        location: location || 'Packaging Workshop',
      },
      Shipped: {
        title: 'Handed Over to Courier Partner',
        description: note || `Dispatched via ${order.deliveryDetails?.carrierName || 'Express Courier'} (AWB: ${order.deliveryDetails?.trackingNumber || 'Assigned'}).`,
        location: location || 'Central Logistics Hub',
      },
      'Out for Delivery': {
        title: 'Out for Delivery to Recipient',
        description: note || `Assigned to delivery agent ${order.deliveryDetails?.deliveryAgent?.name || 'Local Courier'} for final delivery.`,
        location: location || (order.deliveryAddress?.city || 'Local Depot'),
      },
      Delivered: {
        title: 'Gift Successfully Delivered',
        description: note || 'Package received and signed for. Heartfelt moments delivered!',
        location: location || `${order.deliveryAddress?.city || 'Recipient Destination'}`,
      },
      Cancelled: {
        title: 'Order Cancelled',
        description: note || 'Order was cancelled. Reserved items returned to catalog.',
        location: location || 'Customer Service',
      },
    };

    if (milestoneDescriptions[status]) {
      const milestone = milestoneDescriptions[status];
      if (!order.deliveryDetails) order.deliveryDetails = {};
      if (!order.deliveryDetails.timeline) order.deliveryDetails.timeline = [];

      order.deliveryDetails.timeline.push({
        status,
        title: milestone.title,
        description: milestone.description,
        location: milestone.location,
        timestamp: new Date(),
      });
    }

    if (status === 'Delivered') {
      order.deliveryDetails.actualDelivery = new Date();
      // If COD, mark paid upon successful delivery
      if (order.paymentInfo?.method === 'cod' && order.paymentInfo?.status !== 'Paid') {
        order.paymentInfo.status = 'Paid';
        order.paymentInfo.paidAt = new Date();
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery & courier details (Admin Delivery Management)
// @route   PATCH /api/orders/:id/delivery
// @access  Private/Admin
const updateDeliveryDetails = async (req, res, next) => {
  try {
    const {
      carrierName,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      actualDelivery,
      deliveryAgent,
      status,
      logMilestone = true,
      milestoneNote,
    } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (!order.deliveryDetails) {
      order.deliveryDetails = { timeline: [] };
    }

    if (carrierName !== undefined) order.deliveryDetails.carrierName = carrierName;
    if (trackingNumber !== undefined) order.deliveryDetails.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) order.deliveryDetails.trackingUrl = trackingUrl;
    if (estimatedDelivery !== undefined) order.deliveryDetails.estimatedDelivery = estimatedDelivery;
    if (actualDelivery !== undefined) order.deliveryDetails.actualDelivery = actualDelivery;
    
    if (deliveryAgent) {
      order.deliveryDetails.deliveryAgent = {
        name: deliveryAgent.name || order.deliveryDetails.deliveryAgent?.name || '',
        phone: deliveryAgent.phone || order.deliveryDetails.deliveryAgent?.phone || '',
        vehicleType: deliveryAgent.vehicleType || order.deliveryDetails.deliveryAgent?.vehicleType || '',
      };
    }

    // If status changed or explicitly provided
    if (status && status !== order.status) {
      order.status = status;
      if (status === 'Delivered') {
        order.deliveryDetails.actualDelivery = new Date();
      }
    }

    // Append a delivery milestone log if requested
    if (logMilestone) {
      const milestoneTitle =
        status === 'Shipped'
          ? `Dispatched via ${order.deliveryDetails.carrierName}`
          : status === 'Out for Delivery'
          ? `Out for Delivery with ${order.deliveryDetails.deliveryAgent?.name || 'Agent'}`
          : `Logistics Updated: ${order.deliveryDetails.carrierName}`;

      order.deliveryDetails.timeline.push({
        status: status || order.status,
        title: milestoneTitle,
        description:
          milestoneNote ||
          `Tracking # ${order.deliveryDetails.trackingNumber}. Estimated arrival: ${
            order.deliveryDetails.estimatedDelivery
              ? new Date(order.deliveryDetails.estimatedDelivery).toLocaleDateString()
              : 'Prompt'
          }.`,
        location: order.deliveryAddress?.city || 'Logistics Hub',
        timestamp: new Date(),
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Delivery details updated successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add custom delivery timeline milestone
// @route   POST /api/orders/:id/timeline
// @access  Private/Admin
const addDeliveryTimelineMilestone = async (req, res, next) => {
  try {
    const { title, description, location, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Milestone title is required.',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (!order.deliveryDetails) {
      order.deliveryDetails = { timeline: [] };
    }

    const newMilestone = {
      status: status || order.status,
      title: title.trim(),
      description: description ? description.trim() : '',
      location: location ? location.trim() : 'En Route',
      timestamp: new Date(),
    };

    order.deliveryDetails.timeline.push(newMilestone);

    // If new status specified, update order status
    if (status && status !== order.status) {
      order.status = status;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Milestone added to delivery timeline.',
      timeline: order.deliveryDetails.timeline,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process / Confirm online payment (Payment System Gateway simulation)
// @route   POST /api/orders/:id/pay
// @access  Private (Owner or Admin)
const processPayment = async (req, res, next) => {
  try {
    const { paymentMethod = 'card', details = {}, shouldSimulateSuccess = true } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Check ownership
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to process payment for this order.',
      });
    }

    if (!shouldSimulateSuccess) {
      order.paymentInfo.status = 'Failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Payment was declined by the issuing gateway / bank. Please try again.',
      });
    }

    const txnId = generateTransactionId(paymentMethod);

    order.paymentInfo = {
      method: paymentMethod,
      status: 'Paid',
      transactionId: txnId,
      paidAt: new Date(),
      amountPaid: order.totalAmount,
      details: {
        ...details,
        gatewayResponse: 'APPROVED_AUTH_200',
      },
    };

    if (order.status === 'Pending') {
      order.status = 'Confirmed';
    }

    // Add payment confirmed milestone
    if (!order.deliveryDetails) order.deliveryDetails = { timeline: [] };
    order.deliveryDetails.timeline.push({
      status: 'Confirmed',
      title: `Payment Verified (${paymentMethod.toUpperCase()})`,
      description: `Payment of $${order.totalAmount.toFixed(2)} completed successfully. Transaction ID: #${txnId}`,
      location: 'Payment Gateway',
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment completed successfully!',
      transactionId: txnId,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status (Admin CMS / Refunds)
// @route   PATCH /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, refundReason } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    order.paymentInfo.status = status;
    if (status === 'Refunded') {
      order.paymentInfo.refundedAt = new Date();
      order.paymentInfo.refundReason = refundReason || 'Requested by customer or order cancelled';

      if (!order.deliveryDetails) order.deliveryDetails = { timeline: [] };
      order.deliveryDetails.timeline.push({
        status: 'Cancelled',
        title: 'Payment Refunded',
        description: `Full refund of $${order.totalAmount.toFixed(2)} issued. Reason: ${order.paymentInfo.refundReason}`,
        location: 'Billing & Accounts',
        timestamp: new Date(),
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Payment status updated to "${status}".`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & summaries including delivery analytics (Admin CMS)
// @route   GET /api/orders/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalCategories,
      recentOrders,
      lowStockProducts,
      pendingDispatch,
      inTransit,
      deliveredOrders,
      paidOrdersCount,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Category.countDocuments(),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
      Product.find({ stock: { $lte: 5 } })
        .select('name stock price category')
        .populate('category', 'name')
        .limit(6),
      Order.countDocuments({ status: { $in: ['Pending', 'Confirmed', 'Packed'] } }),
      Order.countDocuments({ status: { $in: ['Shipped', 'Out for Delivery'] } }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.countDocuments({ 'paymentInfo.status': 'Paid' }),
    ]);

    // Calculate total revenue from paid orders
    const revenueAggregation = await Order.aggregate([
      { $match: { 'paymentInfo.status': 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalCategories,
        pendingDispatch,
        inTransit,
        deliveredOrders,
        paidOrdersCount,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

