import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Truck,
  IndianRupee,
  ArrowRight,
  Sparkles,
  Building,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import api from '../../services/api';

const indianStates = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const SellerRegisterPage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    storeName: '',
    gstin: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already a seller, direct them to dashboard
  if (user?.role === 'seller' || user?.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          You're already an active GiftNest Seller!
        </h1>
        <p className="text-stone-600 max-w-md mx-auto text-sm">
          Your merchant account <strong className="text-blue-700">{user?.sellerProfile?.storeName || user.name}</strong> is verified and ready to list products and process orders.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/seller/dashboard"
            className="px-8 py-3.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center space-x-2"
          >
            <span>Open Seller Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate('/login?redirect=become-seller');
      return;
    }

    if (!formData.storeName.trim() || !formData.city.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory seller details.');
      return;
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
      setError('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    if (formData.gstin && formData.gstin.trim().length < 10) {
      setError('Please provide a valid GSTIN format (or leave empty if exempted).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/seller/register', {
        storeName: formData.storeName.trim(),
        gstin: formData.gstin.trim().toUpperCase(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        phone: formData.phone.trim(),
      });

      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Congratulations! Welcome to GiftNest Seller Hub 🎉', 'success');
        navigate('/seller/dashboard');
      }
    } catch (err) {
      console.error('Seller registration error:', err);
      setError(err.response?.data?.message || 'Failed to complete seller registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section (Flipkart Seller Hub Style) */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <Store className="w-4 h-4 text-blue-600" />
            <span>GiftNest Seller Hub • Flipkart Marketplace Model</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 tracking-tight leading-tight">
            Sell to Millions of Shoppers Across India
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Grow your business with India's premier curated marketplace. List electronics, fashion, gourmet treats, and personalized gifts with seamless Ekart courier pickups and fast payouts.
          </p>
        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">0% Commission</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enjoy 0% platform commission on all catalog sales for your first 30 days.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Doorstep Logistics</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Ekart Logistics & BlueDart courier agents pick up parcels right from your warehouse.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">NestAssured Badge</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Earn the trusted quality badge on your listings to boost sales conversion by 2.5x.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">7-Day Payouts</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Direct automated bank settlement to your Indian savings/current account.
            </p>
          </div>
        </div>

        {/* Onboarding Form Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Register Your Merchant Store
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Provide your business and GST details to launch your seller storefront in 2 minutes.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-2xl text-xs flex items-center justify-between">
              <span>You must be logged in to register as a seller.</span>
              <Link
                to="/login?redirect=become-seller"
                className="font-bold text-blue-700 underline hover:text-blue-900"
              >
                Sign In First →
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Business / Store Name *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g. TechNest India Retail or Jaipur Artisans Hub"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  GSTIN (15 Digits)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="gstin"
                    maxLength={15}
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="29AABCU9603R1ZM"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Leave blank if GST exempted for handicraft
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Business Phone (+91) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  State *
                </label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all hover:scale-101 active:scale-99 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit & Launch Seller Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              By registering, you agree to the GiftNest Seller Terms & Conditions, 7-day buyer return policy, and Flipkart-style fulfillment SLA.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
