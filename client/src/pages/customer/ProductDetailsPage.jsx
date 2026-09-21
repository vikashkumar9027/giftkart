import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Minus,
  Plus,
  Check,
  Star,
  MapPin,
  RefreshCw,
  Award,
  CheckCircle2,
  Store,
  Zap,
  Maximize2,
  Minimize2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/common/Toast';
import ProductCard from '../../components/customer/ProductCard';

const packagingOptions = [
  {
    id: 'classic',
    name: 'Classic Eco-Kraft Box',
    price: 0,
    desc: 'Sustainable biodegradable kraft box tied with organic twine.',
  },
  {
    id: 'floral',
    name: 'Celebration Floral Wrap',
    price: 99,
    desc: 'Artisan floral botanical paper wrap with hand-tied satin ribbon.',
  },
  {
    id: 'velvet',
    name: 'Royal Velvet Keepsake Box',
    price: 199,
    desc: 'Plush velvet rigid jewelry hamper box with magnetic closure.',
  },
  {
    id: 'wooden',
    name: 'Artisan Wooden Keepsake Crate',
    price: 349,
    desc: 'Hand-carved pine keepsake box with burnt brass clasp.',
  },
];

const ribbonColors = [
  { name: 'Crimson Velvet', color: '#9f1239' },
  { name: 'Champagne Gold', color: '#d97706' },
  { name: 'Blush Silk', color: '#f472b6' },
  { name: 'Emerald Forest', color: '#047857' },
  { name: 'Midnight Navy', color: '#1e3a8a' },
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Customization & Packaging states
  const [recipientName, setRecipientName] = useState('');
  const [customText, setCustomText] = useState('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState(packagingOptions[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(ribbonColors[0].name);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Flipkart & Amazon style full screen image modal
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreenOpen(false);
        setIsZoomed(false);
      }
    };
    if (isFullscreenOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreenOpen]);

  // Flipkart-style Pincode Delivery Estimator
  const [pincode, setPincode] = useState('560001');
  const [pincodeStatus, setPincodeStatus] = useState({
    checked: true,
    available: true,
    city: 'Bengaluru',
    state: 'Karnataka',
    estDays: 'Tomorrow, by 9 PM',
    codAvailable: true,
  });

  const handleCheckPincode = (e) => {
    e?.preventDefault();
    const pin = pincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      showToast('Please enter a valid 6-digit Indian PIN code (e.g. 560001)', 'error');
      return;
    }
    const prefix = pin.substring(0, 2);
    let city = 'Metro Hub';
    let state = 'India';
    let days = '2 - 3 Days';
    if (['56', '57', '58', '59'].includes(prefix)) { city = 'Bengaluru'; state = 'Karnataka'; days = 'Tomorrow, by 9 PM'; }
    else if (['40', '41', '42', '43', '44'].includes(prefix)) { city = 'Mumbai / Pune'; state = 'Maharashtra'; days = 'Tomorrow, by 9 PM'; }
    else if (['11', '12', '20'].includes(prefix)) { city = 'Delhi NCR'; state = 'Delhi'; days = 'Tomorrow, by 9 PM'; }
    else if (['60', '61', '62', '63', '64'].includes(prefix)) { city = 'Chennai'; state = 'Tamil Nadu'; days = 'in 2 Days'; }
    else if (['70', '71', '72'].includes(prefix)) { city = 'Kolkata'; state = 'West Bengal'; days = 'in 2-3 Days'; }
    else if (['50', '51', '52'].includes(prefix)) { city = 'Hyderabad'; state = 'Telangana'; days = 'Tomorrow, by 9 PM'; }
    else if (['38', '39'].includes(prefix)) { city = 'Ahmedabad'; state = 'Gujarat'; days = 'in 2 Days'; }
    else { city = 'Regional Delivery Hub'; days = 'in 3-4 Days'; }

    setPincodeStatus({
      checked: true,
      available: true,
      city,
      state,
      estDays: days,
      codAvailable: true,
    });
    showToast(`Delivery available to ${pin} (${city}, ${state})`, 'success');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || '');
          setQuantity(1);

          // Fetch related products in the same category or occasion
          const relatedRes = await api.get(
            `/products?category=${prod.category?._id || ''}&limit=4`
          );
          if (relatedRes.data.success) {
            setRelatedProducts(
              relatedRes.data.products.filter((p) => p._id !== prod._id)
            );
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          {error || 'Product Not Found'}
        </h2>
        <p className="text-sm text-stone-500">
          The gift item you were looking for might have been retired or does not exist.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gifting Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleQuantityChange = (delta) => {
    const nextVal = quantity + delta;
    if (nextVal >= 1 && nextVal <= product.stock) {
      setQuantity(nextVal);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const customization = {
      recipientName: recipientName.trim(),
      customText: customText.trim(),
      customPhotoUrl: customPhotoUrl.trim(),
      occasionBadge: product.occasion || '',
    };

    const packaging = {
      name: selectedPackaging.name,
      price: selectedPackaging.price,
      ribbonColor: selectedRibbon,
    };

    const result = addToCart(product, quantity, customization, packaging);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    const customization = {
      recipientName: recipientName.trim(),
      customText: customText.trim(),
      customPhotoUrl: customPhotoUrl.trim(),
      occasionBadge: product.occasion || '',
    };

    const packaging = {
      name: selectedPackaging.name,
      price: selectedPackaging.price,
      ribbonColor: selectedRibbon,
    };

    const result = addToCart(product, quantity, customization, packaging);
    if (result.success) {
      navigate('/checkout');
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb / Back Link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to browsing
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image (Clickable to open Fullscreen Lightbox) */}
          <div
            onClick={() => setIsFullscreenOpen(true)}
            className="group relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md cursor-zoom-in"
            title="Click to open full screen photo with details (Flipkart & Amazon style)"
          >
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Featured
              </span>
            )}
            <span
              className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                isOutOfStock
                  ? 'bg-rose-100 text-rose-800'
                  : product.stock <= 5
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : product.stock <= 5
                ? `Only ${product.stock} Units Remaining`
                : 'In Stock & Ready to Ship'}
            </span>

            {/* Flipkart & Amazon style full screen zoom hint */}
            <div className="absolute bottom-4 right-4 bg-stone-900/85 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-lg backdrop-blur-xs transition-all pointer-events-none">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Screen View</span>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-rose-600 ring-2 ring-rose-200 scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Category and Occasion pills */}
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                {product.category?.name || 'Curated Gift'}
              </span>
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                {product.occasion}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Assured Badge (Flipkart Style) */}
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <div className="inline-flex items-center bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                <span>{(product.rating || 4.5).toFixed(1)}</span>
                <Star className="w-3 h-3 ml-1 fill-white" />
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {(product.ratingsCount || 1280).toLocaleString('en-IN')} Ratings &amp; 340 Reviews
              </span>
              {product.isAssured !== false && (
                <span className="inline-flex items-center text-xs font-black italic text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200" title="Flipkart NestAssured Quality Verified">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Nest<span className="text-amber-500">Assured</span>
                </span>
              )}
            </div>

            {/* Price & Discounts (Flipkart Style) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-stone-900">
                  {formatCurrency(product.price)}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatCurrency(product.mrp)}
                  </span>
                )}
                {calculateDiscount(product.mrp, product.price) > 0 && (
                  <span className="text-base font-bold text-emerald-600">
                    {calculateDiscount(product.mrp, product.price)}% off
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Inclusive of all taxes • {product.price >= 499 ? 'Free Delivery' : '₹40 Delivery on orders below ₹499'}
              </p>
            </div>

            {/* Flipkart-Style Promotional Offers Box */}
            <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/80 space-y-1.5 text-xs text-stone-700">
              <div className="font-bold text-emerald-800 flex items-center">
                <Award className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Available Offers &amp; Discounts:
              </div>
              <ul className="space-y-1 text-[11px] text-stone-600 list-disc list-inside">
                <li><strong>Bank Offer:</strong> Extra 5% cashback on UPI, RuPay Cards &amp; Net Banking</li>
                <li><strong>Special Gift Perk:</strong> Free handwritten artisan gift note card</li>
                <li><strong>NestAssured:</strong> 7 Days Replacement Policy &amp; 100% Genuine Quality</li>
              </ul>
            </div>

            {/* Pincode Delivery Estimator (Flipkart Style) */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  Deliver to Indian PIN Code:
                </span>
                {pincodeStatus.checked && (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Available in {pincodeStatus.city}
                  </span>
                )}
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit PIN"
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs w-44 focus:ring-2 focus:ring-rose-500 outline-none bg-white font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Check
                </button>
              </form>
              {pincodeStatus.checked && (
                <div className="text-[11px] text-stone-600 space-y-1 pt-1.5 border-t border-stone-200">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      Delivery by <strong>{pincodeStatus.estDays}</strong> |{' '}
                      <span className="text-emerald-600 font-bold">
                        {product.price >= 499 ? 'FREE Delivery' : 'Standard Delivery'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cash on Delivery Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Information Card (Flipkart Style) */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Store className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-stone-800">
                    Sold by: <span className="text-rose-600 font-semibold">{product.seller?.sellerProfile?.storeName || product.seller?.name || 'TechNest India Retail'}</span>
                  </span>
                </div>
                <div className="inline-flex items-center bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  <span>{product.seller?.sellerProfile?.rating || '4.8'}</span>
                  <Star className="w-2.5 h-2.5 ml-0.5 fill-white" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                <span>GSTIN: {product.seller?.sellerProfile?.gstin || '29AABCU9603R1ZM'} (Verified)</span>
                <span>Ships from {product.seller?.sellerProfile?.city || 'Bengaluru'}, {product.seller?.sellerProfile?.state || 'Karnataka'}</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px] text-stone-600 pt-1">
                <span className="flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1 text-blue-600" />
                  7 Days Replacement
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  GST Invoice Available
                </span>
              </div>
            </div>

            {/* Highlights (if any) */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Key Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Product Details
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Gift Customization & Packing Studio Accordion */}
            <div className="pt-2 border-t border-stone-200">
              <div className="bg-rose-50/40 rounded-3xl p-5 border border-rose-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        Artisan Customization & Gift Packing
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Add personalized name engraving, photo cloche, and luxury packaging.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-full border border-rose-200 shadow-xs"
                  >
                    {isCustomizing ? 'Hide Options' : 'Personalize Gift'}
                  </button>
                </div>

                {isCustomizing && (
                  <div className="space-y-4 pt-3 border-t border-rose-100/80 animate-fade-in text-xs">
                    {/* Recipient & Engraving Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Recipient Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. For Sophia"
                          maxLength={35}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Custom Engraving / Plaque Text
                        </label>
                        <input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="e.g. Always & Forever 2026"
                          maxLength={45}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Photo URL (For Photo Plaques / Frames) */}
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Personalized Photo Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={customPhotoUrl}
                        onChange={(e) => setCustomPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... (Image URL for engraved photo gifts)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      {customPhotoUrl && (
                        <div className="mt-2 flex items-center space-x-2">
                          <img
                            src={customPhotoUrl}
                            alt="Customization Preview"
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                          <span className="text-[11px] text-emerald-600 font-medium">
                            Photo preview attached
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Packaging Style Selection */}
                    <div>
                      <label className="block font-bold text-stone-700 mb-2">
                        Select Signature Gift Packaging
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {packagingOptions.map((pkg) => {
                          const isSelected = selectedPackaging.id === pkg.id;
                          return (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedPackaging(pkg)}
                              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-white border-rose-600 ring-2 ring-rose-200 shadow-xs'
                                  : 'bg-white/60 border-stone-200 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-stone-900">{pkg.name}</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                    pkg.price === 0
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  {pkg.price === 0 ? 'FREE' : `+${formatCurrency(pkg.price)}`}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-tight">{pkg.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ribbon Color Palette */}
                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">
                        Ribbon Satin Finish: <span className="text-rose-600 font-serif">{selectedRibbon}</span>
                      </label>
                      <div className="flex items-center space-x-3">
                        {ribbonColors.map((rb) => (
                          <button
                            key={rb.name}
                            type="button"
                            onClick={() => setSelectedRibbon(rb.name)}
                            className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                              selectedRibbon === rb.name
                                ? 'scale-125 ring-2 ring-rose-500 ring-offset-2'
                                : 'opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: rb.color }}
                            title={rb.name}
                          >
                            {selectedRibbon === rb.name && (
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Customization Summary Preview */}
                    {(customText || recipientName) && (
                      <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                          Preview of Inscription on Gift:
                        </span>
                        <p className="font-serif italic text-stone-800 text-xs">
                          {recipientName ? `"${recipientName}" — ` : ''}{customText}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {!isOutOfStock && (
                  <span className="text-xs text-stone-400">
                    {product.stock} units available
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300 shadow-none'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:scale-102 active:scale-98'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isOutOfStock
                      ? 'Out of Stock'
                      : `Add to Cart • ${formatCurrency(
                          (product.price + selectedPackaging.price) * quantity
                        )}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-full font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300 shadow-none'
                      : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-stone-950 shadow-amber-400/30 hover:scale-102'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-stone-950 text-stone-950" />
                  <span>Buy Now Directly</span>
                </button>

                <Link
                  to="/cart"
                  className="py-3.5 px-5 rounded-full font-bold text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 text-center transition-colors flex items-center justify-center"
                >
                  Cart
                </Link>
              </div>
            </div>
          </div>


            {/* Specifications Section (Flipkart Style) */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Specifications
                </h3>
                <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                  {Object.entries(product.specifications).map(([k, v], idx) => (
                    <div
                      key={k}
                      className={`grid grid-cols-3 p-2.5 ${
                        idx % 2 === 0 ? 'bg-stone-50/70' : 'bg-white'
                      }`}
                    >
                      <span className="font-medium text-stone-500 capitalize">{k}</span>
                      <span className="col-span-2 font-semibold text-stone-800">{v}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 p-2.5 bg-stone-50/70">
                    <span className="font-medium text-stone-500">Country of Origin</span>
                    <span className="col-span-2 font-semibold text-stone-800">India 🇮🇳</span>
                  </div>
                </div>
              </div>
            )}

          {/* Flipkart-Style Trust Badges */}
          <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200 space-y-2.5">
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span><strong>Ekart &amp; BlueDart Express:</strong> Delivered in secure, tamper-proof packaging</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0" />
              <span><strong>Personalised Gifting:</strong> Free handwritten card &amp; luxury gift-wrapping available</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-700">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span><strong>NestAssured Guarantee:</strong> 100% genuine products with 7-Day hassle-free replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              You May Also Love
            </h2>
            <Link
              to="/shop"
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Flipkart & Amazon Style Fullscreen Image Lightbox Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between text-white animate-fade-in select-none">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-black/40">
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xl">
                {product.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Photo {((product.images || [selectedImage]).indexOf(selectedImage) + 1) || 1} of {(product.images && product.images.length) || 1} • Tap image to toggle zoom
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isZoomed ? "Reset Zoom" : "Zoom In"}
              >
                {isZoomed ? <Minimize2 className="w-5 h-5 text-amber-300" /> : <ZoomIn className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFullscreenOpen(false);
                  setIsZoomed(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Close Full Screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center High-Res Image View Area */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            {/* Previous Photo Button */}
            {product.images && product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const list = product.images;
                  const currIdx = list.indexOf(selectedImage);
                  const prevIdx = (currIdx - 1 + list.length) % list.length;
                  setSelectedImage(list[prevIdx]);
                }}
                className="absolute left-4 z-10 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Interactive Zoom Image */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={selectedImage}
                alt={product.name}
                onClick={() => setIsZoomed(!isZoomed)}
                className={`max-h-[48vh] sm:max-h-[68vh] max-w-full object-contain transition-all duration-300 rounded-2xl cursor-pointer ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 hover:scale-102 cursor-zoom-in'
                }`}
              />
            </div>

            {/* Next Photo Button */}
            {product.images && product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const list = product.images;
                  const currIdx = list.indexOf(selectedImage);
                  const nextIdx = (currIdx + 1) % list.length;
                  setSelectedImage(list[nextIdx]);
                }}
                className="absolute right-4 z-10 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Thumbnails + Details & Direct Purchase */}
          <div className="p-3 sm:p-5 border-t border-white/10 bg-black/70 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 ? (
              <div className="flex items-center space-x-2.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-rose-500 ring-2 ring-rose-400 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stone-400 hidden sm:block">
                Exclusive Handcrafted Artisan Series
              </div>
            )}

            {/* Details & Actions */}
            <div className="flex items-center space-x-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div>
                <div className="text-base sm:text-xl font-black text-white">
                  {formatCurrency(product.price)}
                </div>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-xs font-bold text-emerald-400">
                    {calculateDiscount(product.mrp, product.price)}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                  }}
                  disabled={isOutOfStock}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreenOpen(false);
                    handleBuyNow();
                  }}
                  disabled={isOutOfStock}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition-all active:scale-95 shadow-md shadow-amber-400/20 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-stone-950 text-stone-950" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
