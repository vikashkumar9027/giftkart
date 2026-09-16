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
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

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
    giftMessage: '',
    deliveryDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shippingFee = subtotal >= 50 ? 0 : 7.99;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e) => {
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
      setError('Please fill in all required delivery details.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        giftMessage: formData.giftMessage,
        deliveryDate: formData.deliveryDate || undefined,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="border-b border-stone-200 pb-5">
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Checkout & Delivery
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete the delivery recipient details to place your curated gifting order.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Form: Delivery Address & Personalization */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Recipient Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <Truck className="w-5 h-5 text-rose-600" />
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  Recipient & Delivery Address
                </h2>
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
                    onChange={handleChange}
                    placeholder="e.g. John Doe or Emily Watson"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Apartment, suite, street address..."
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
                    onChange={handleChange}
                    placeholder="City"
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
                    onChange={handleChange}
                    placeholder="State"
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
                    onChange={handleChange}
                    placeholder="e.g. 90210"
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Optional Gift Personalization */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                <Heart className="w-5 h-5 text-rose-600" />
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  Gifting Personalization (Optional)
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Handwritten Greeting Card Message
                  </label>
                  <textarea
                    name="giftMessage"
                    rows={3}
                    value={formData.giftMessage}
                    onChange={handleChange}
                    placeholder="Write a heartfelt note for the recipient. We will handwrite this inside an artisan embossed card."
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>Preferred Delivery Date</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="w-full sm:w-64 px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Place Order */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
                Summary & Confirm
              </h3>

              {/* Items preview list */}
              <div className="max-h-48 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center space-x-3 pt-2 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
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
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-stone-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Due</span>
                  <span className="text-rose-600 text-lg font-serif">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Type Notice */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Cash on Delivery / Gift Nest Credit</span>
                </div>
                <p className="text-stone-500">
                  No online payment gateway needed. Payment will be collected upon gift arrival or pre-arranged.
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Place Gifting Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-stone-400">
                  Safe & encrypted checkout • Fast order tracking
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
