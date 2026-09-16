import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Heart,
  Calendar,
  Lock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  QrCode,
  Building,
  DollarSign,
  Gift,
  CheckCircle2,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

const packagingOptions = [
  {
    boxType: 'classic',
    name: 'Classic Eco-Kraft Box',
    price: 0,
    desc: 'Sustainable recycled kraft box with shredded nest cushioning & botanical seal.',
  },
  {
    boxType: 'velvet',
    name: 'Royal Velvet Keepsake Box',
    price: 12.0,
    desc: 'Plush velvet casing with gilded gold corners & magnetic enclosure.',
  },
  {
    boxType: 'floral',
    name: 'Artisan Floral Wrap & Wax Seal',
    price: 8.0,
    desc: 'Handmade Italian floral parchment tied with natural twine and hot wax monogram.',
  },
  {
    boxType: 'wooden',
    name: 'Handcrafted Wooden Crate',
    price: 18.0,
    desc: 'Solid pine keepsake chest with sliding brass latch & reusable memory box.',
  },
];

const ribbonOptions = [
  { name: 'Burgundy Silk', color: '#881337' },
  { name: 'Royal Gold', color: '#d97706' },
  { name: 'Emerald Satin', color: '#047857' },
  { name: 'Rose Pink', color: '#f43f5e' },
  { name: 'Midnight Silver', color: '#475569' },
];

const cardThemes = [
  { id: 'Birthday Elegance', label: '🎂 Birthday Elegance' },
  { id: 'Romantic Anniversary', label: '💍 Romantic Anniversary' },
  { id: 'Wedding Blessing', label: '💒 Wedding Blessing' },
  { id: 'Golden Festivities', label: '🪔 Golden Festivities' },
  { id: 'Executive Corporate', label: '💼 Executive Corporate' },
];

const popularBanks = [
  'Chase Bank',
  'Bank of America',
  'Wells Fargo',
  'Citibank',
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
];

const CheckoutPage = () => {
  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  // If cart is empty, redirect to cart
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Delivery details form state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryDate: '',
  });

  // Gift Packaging & Ribbon Selection
  const [selectedPackaging, setSelectedPackaging] = useState(packagingOptions[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(ribbonOptions[0].name);

  // Handwritten Greeting Card Live Preview State
  const [greetingCard, setGreetingCard] = useState({
    theme: 'Birthday Elegance',
    recipientName: '',
    message: 'Wishing you a magnificent celebration filled with joy, laughter, and unforgettable moments!',
    senderName: user?.name || 'With Love',
    fontStyle: 'italic font-serif',
  });

  // Multi-method payment tabs
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'cod'

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8920',
    cardName: user?.name || 'SARAH JENKINS',
    cardExpiry: '08/29',
    cardCvv: '839',
  });

  // UPI state
  const [upiId, setUpiId] = useState('sarah@okaxis');
  const [upiSimulatedApproved, setUpiSimulatedApproved] = useState(false);

  // Net banking state
  const [selectedBank, setSelectedBank] = useState(popularBanks[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeliveryChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shippingFee = subtotal >= 50 ? 0 : 7.99;
  const packagingFee = selectedPackaging.price;
  const grandTotal = subtotal + shippingFee + packagingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all required delivery address fields.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      // Simulate realistic payment details
      let paymentInfo = {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        details: {},
      };

      if (paymentMethod === 'card') {
        paymentInfo.details = {
          last4: cardDetails.cardNumber.slice(-4) || '8920',
          cardBrand: 'Visa / Mastercard',
          authCode: 'AUTH_OK_3DS',
        };
      } else if (paymentMethod === 'upi') {
        paymentInfo.details = {
          upiId: upiId.trim(),
          vpaProvider: 'UPI Instant Settlement Gateway',
        };
      } else if (paymentMethod === 'netbanking') {
        paymentInfo.details = {
          bankName: selectedBank,
          channel: 'Direct NetBanking Gateway',
        };
      } else if (paymentMethod === 'cod') {
        paymentInfo.details = {
          cashCollectionExpected: grandTotal,
          instructions: 'Collect in cash or via delivery agent POS',
        };
      }

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customization: item.customization || {},
          packaging: item.packaging || {},
        })),
        deliveryAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
        giftPackaging: {
          boxType: selectedPackaging.boxType,
          name: selectedPackaging.name,
          price: selectedPackaging.price,
          ribbonColor: selectedRibbon,
        },
        greetingCard: {
          theme: greetingCard.theme,
          message: greetingCard.message.trim(),
          senderName: greetingCard.senderName.trim(),
          fontStyle: greetingCard.fontStyle,
        },
        giftMessage: greetingCard.message.trim(),
        deliveryDate: formData.deliveryDate || undefined,
        paymentInfo,
        totalAmount: grandTotal,
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.order._id}`);
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      const message =
        err.response?.data?.message || 'Failed to place order. Please check your details and try again.';
      setError(message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-8">
        {/* Title */}
        <div className="border-b border-stone-200 pb-5">
          <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Artisanal Checkout</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Personalize, Pack & Place Your Gift Order
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete the delivery recipient details, choose your signature box packaging, inspect the handwritten greeting card, and select payment method.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Columns (2 cols): Recipient, Packaging, Greeting Card, Payment Gateway */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Recipient Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Recipient & Delivery Destination
                  </h2>
                  <p className="text-[11px] text-stone-400">Where should our courier deliver this gift?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Full Name of Recipient *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleDeliveryChange}
                    placeholder="e.g. Sophia Montgomery"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Recipient Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleDeliveryChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleDeliveryChange}
                    placeholder="Apartment, suite, unit, building, street address..."
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleDeliveryChange}
                    placeholder="San Francisco"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleDeliveryChange}
                    placeholder="California"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Postal Code / Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleDeliveryChange}
                    placeholder="94107"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>Target Delivery Date (Optional)</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deliveryDate}
                    onChange={handleDeliveryChange}
                    className="w-full sm:w-64 px-4 py-2.5 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Select a special anniversary, birthday, or festival date for priority courier coordination.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Signature Luxury Packaging & Ribbon Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Luxury Packaging & Presentation
                  </h2>
                  <p className="text-[11px] text-stone-400">Choose the signature box and satin ribbon finish for unboxing.</p>
                </div>
              </div>

              {/* Box Type Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Select Box Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packagingOptions.map((pkg) => {
                    const isSelected = selectedPackaging.boxType === pkg.boxType;
                    return (
                      <div
                        key={pkg.boxType}
                        onClick={() => setSelectedPackaging(pkg)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-rose-50/30 border-rose-600 ring-2 ring-rose-200 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-stone-900">{pkg.name}</span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              pkg.price === 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {pkg.price === 0 ? 'FREE' : `+${formatCurrency(pkg.price)}`}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">{pkg.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ribbon Selection */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Satin Ribbon Color Finish: <strong className="text-rose-700">{selectedRibbon}</strong>
                </label>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {ribbonOptions.map((ribbon) => {
                    const isSelected = selectedRibbon === ribbon.name;
                    return (
                      <button
                        key={ribbon.name}
                        type="button"
                        onClick={() => setSelectedRibbon(ribbon.name)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-300'
                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: ribbon.color }}
                        />
                        <span>{ribbon.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Interactive Handwritten Greeting Card Live Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Handwritten Greeting Card & Live Preview
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Type your message and watch your card render in real time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-600 mb-1">Card Occasion Theme</label>
                    <select
                      value={greetingCard.theme}
                      onChange={(e) => setGreetingCard({ ...greetingCard, theme: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    >
                      {cardThemes.map((th) => (
                        <option key={th.id} value={th.id}>
                          {th.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      Recipient Greeting Line
                    </label>
                    <input
                      type="text"
                      value={greetingCard.recipientName}
                      onChange={(e) =>
                        setGreetingCard({ ...greetingCard, recipientName: e.target.value })
                      }
                      placeholder="e.g. Dearest Sophia,"
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      Your Heartfelt Message
                    </label>
                    <textarea
                      rows={4}
                      value={greetingCard.message}
                      onChange={(e) =>
                        setGreetingCard({ ...greetingCard, message: e.target.value })
                      }
                      placeholder="Write your note here..."
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-600 mb-1">
                      Sender Name / Closing
                    </label>
                    <input
                      type="text"
                      value={greetingCard.senderName}
                      onChange={(e) =>
                        setGreetingCard({ ...greetingCard, senderName: e.target.value })
                      }
                      placeholder="e.g. Always Yours, Sarah"
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                {/* Live Card Render Box */}
                <div className="flex flex-col justify-center">
                  <div className="relative rounded-2xl bg-[#FFFDF9] p-6 sm:p-7 border-2 border-amber-200/80 shadow-md text-stone-800 space-y-4 transform hover:rotate-0 -rotate-1 transition-transform">
                    {/* Decorative Corner Ornaments */}
                    <div className="absolute top-2 left-2 text-amber-400 text-xs select-none">✦</div>
                    <div className="absolute top-2 right-2 text-amber-400 text-xs select-none">✦</div>
                    <div className="absolute bottom-2 left-2 text-amber-400 text-xs select-none">✦</div>
                    <div className="absolute bottom-2 right-2 text-amber-400 text-xs select-none">✦</div>

                    <div className="text-center pb-2 border-b border-amber-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                        {greetingCard.theme}
                      </span>
                    </div>

                    <div className="space-y-3 min-h-[140px] flex flex-col justify-between">
                      {greetingCard.recipientName ? (
                        <p className="font-serif font-bold text-sm text-stone-900">
                          {greetingCard.recipientName}
                        </p>
                      ) : (
                        <p className="font-serif font-bold text-sm text-stone-400 italic">
                          (Recipient Greeting)
                        </p>
                      )}

                      <p className="font-serif italic text-sm text-stone-800 leading-relaxed whitespace-pre-line px-1">
                        "{greetingCard.message || 'Write a heartfelt message to celebrate...'}"
                      </p>

                      <p className="text-right font-serif font-bold text-xs text-rose-800 pt-2 border-t border-amber-100">
                        — {greetingCard.senderName || 'Your Name'}
                      </p>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-[9px] text-stone-400 uppercase tracking-widest">
                        Embossed on Heavy Cotton Cardstock • Sealed with Satin Ribbon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Multi-Method Payment Gateway */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-stone-900">
                    Payment Gateway & Confirmation
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Select payment method. Simulation generates instant transaction IDs & receipts.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-rose-50 text-rose-900 border-rose-600 ring-2 ring-rose-200'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-rose-50 text-rose-900 border-rose-600 ring-2 ring-rose-200'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI & QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-rose-50 text-rose-900 border-rose-600 ring-2 ring-rose-200'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 text-xs font-bold transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-rose-50 text-rose-900 border-rose-600 ring-2 ring-rose-200'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>COD</span>
                </button>
              </div>

              {/* Tab 1: Credit / Debit Card with Interactive Visual Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  {/* Visual Card Preview */}
                  <div className="max-w-sm mx-auto rounded-3xl p-6 bg-gradient-to-tr from-stone-900 via-stone-800 to-rose-950 text-white shadow-xl space-y-6 border border-stone-700">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-7 rounded-md bg-amber-400/90 shadow-inner flex items-center justify-center text-[10px] font-bold text-stone-900">
                        CHIP
                      </div>
                      <span className="font-serif italic font-bold tracking-wider text-rose-400">
                        GiftNest Card
                      </span>
                    </div>

                    <div className="font-mono text-lg sm:text-xl tracking-widest text-stone-100">
                      {cardDetails.cardNumber}
                    </div>

                    <div className="flex justify-between text-xs text-stone-300">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-stone-400">
                          Cardholder
                        </span>
                        <span className="font-bold tracking-wider uppercase">
                          {cardDetails.cardName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-stone-400">
                          Expires
                        </span>
                        <span className="font-bold">{cardDetails.cardExpiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                        }
                        placeholder="4532 8920 1029 4820"
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-600 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.cardName}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cardName: e.target.value })
                        }
                        placeholder="SARAH JENKINS"
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs uppercase focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-stone-600 mb-1">MM/YY</label>
                        <input
                          type="text"
                          value={cardDetails.cardExpiry}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cardExpiry: e.target.value })
                          }
                          placeholder="08/29"
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-600 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardDetails.cardCvv}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, cardCvv: e.target.value })
                          }
                          placeholder="839"
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: UPI & QR Code Scan */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 pt-2 animate-fade-in text-xs text-center">
                  <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 max-w-sm mx-auto space-y-3">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Scan QR with any UPI App
                    </span>

                    {/* Interactive SVG QR representation */}
                    <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-sm border border-stone-200 flex flex-col items-center justify-center space-y-1">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-stone-900 rounded-lg text-white">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              i % 2 === 0 || i % 3 === 0 ? 'bg-white' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="font-bold text-sm text-stone-900">
                      Amount: {formatCurrency(grandTotal)}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      GPay • PhonePe • Paytm • BHIM • AmazonPay
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto text-left space-y-2">
                    <label className="block font-bold text-stone-600">Or Pay via UPI VPA ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis"
                        className="flex-1 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiSimulatedApproved(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        {upiSimulatedApproved ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-4 pt-2 animate-fade-in text-xs">
                  <label className="block font-bold text-stone-600">Select Supported Bank</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {popularBanks.map((bank) => {
                      const isSelected = selectedBank === bank;
                      return (
                        <div
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-2xl border cursor-pointer font-bold text-center transition-all ${
                            isSelected
                              ? 'bg-rose-50 text-rose-900 border-rose-600 ring-2 ring-rose-200'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {bank}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    You will be routed through the simulated secure banking gateway. Instant authorization guaranteed.
                  </p>
                </div>
              )}

              {/* Tab 4: Cash on Delivery */}
              {paymentMethod === 'cod' && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold">
                    <DollarSign className="w-4 h-4 text-amber-700" />
                    <span>Pay in Cash Upon Gift Arrival</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Your gift will be dispatched with priority courier. The recipient or sender may settle the total of{' '}
                    <strong>{formatCurrency(grandTotal)}</strong> directly with the courier agent.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Button */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              {/* Items summary list */}
              <div className="max-h-48 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.product} className="flex items-start space-x-3 pt-2 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                      {item.customization?.customText && (
                        <p className="text-[10px] text-rose-600 truncate">
                          ✎ "{item.customization.customText}"
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-stone-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-stone-800">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Signature Box ({selectedPackaging.name})</span>
                  <span className="font-bold text-stone-800">
                    {packagingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatCurrency(packagingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery & Handling</span>
                  <span className="font-bold text-stone-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Amount</span>
                  <span className="text-rose-600 text-xl font-serif">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Authorize Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-stone-400">
                  Instant AWB Tracking & Tax Receipt generated automatically.
                </p>
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
