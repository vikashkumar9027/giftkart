const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  // Product-level customization (engraving, photo, custom text)
  customization: {
    recipientName: { type: String, default: '' },
    customText: { type: String, default: '' },
    customPhotoUrl: { type: String, default: '' },
    occasionBadge: { type: String, default: '' },
  },
  // Item specific packaging if chosen
  packaging: {
    name: { type: String, default: '' },
    price: { type: Number, default: 0 },
    ribbonColor: { type: String, default: '' },
  },
});

const deliveryAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Recipient name is required'] },
  phone: { type: String, required: [true, 'Contact phone number is required'] },
  address: { type: String, required: [true, 'Street address is required'] },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  pincode: { type: String, required: [true, 'Postal code / Pincode is required'] },
});

const deliveryTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: 'Fulfillment Center' },
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: deliveryAddressSchema,
    
    // Gift Packaging & Presentation
    giftPackaging: {
      boxType: { type: String, default: 'classic' }, // 'classic', 'floral', 'velvet', 'wooden'
      name: { type: String, default: 'Classic Eco-Kraft Box' },
      price: { type: Number, default: 0 },
      ribbonColor: { type: String, default: 'Crimson Velvet' },
    },

    // Handwritten Greeting Card
    greetingCard: {
      theme: { type: String, default: 'Birthday Elegance' },
      message: { type: String, default: '' },
      senderName: { type: String, default: '' },
      fontStyle: { type: String, default: 'handwritten' },
    },

    giftMessage: {
      type: String,
      default: '',
      trim: true,
    },
    deliveryDate: {
      type: Date,
    },
    
    // Delivery Management System fields
    deliveryDetails: {
      carrierName: { type: String, default: 'Standard Express' }, // e.g. FedEx, BlueDart, DHL Express, USPS
      trackingNumber: { type: String, default: '' },
      trackingUrl: { type: String, default: '' },
      estimatedDelivery: { type: Date },
      actualDelivery: { type: Date },
      deliveryAgent: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        vehicleType: { type: String, default: '' },
      },
      timeline: [deliveryTimelineSchema],
    },

    // Payment System fields
    paymentInfo: {
      method: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'cod', 'Card', 'UPI', 'NetBanking', 'Net Banking', 'Credit Card', 'Cash on Delivery', 'COD'],
        default: 'card',
      },
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Paid',
      },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date },
      amountPaid: { type: Number, default: 0 },
      details: { type: mongoose.Schema.Types.Mixed, default: {} },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying & public order tracking
orderSchema.index({ 'deliveryDetails.trackingNumber': 1 });
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
