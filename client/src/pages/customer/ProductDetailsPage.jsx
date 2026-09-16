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
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/common/Toast';
import ProductCard from '../../components/customer/ProductCard';

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
    const result = addToCart(product, quantity);
    if (result.success) {
      showToast(result.message, 'success');
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
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
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
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-stone-400 font-medium">Taxes included</span>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Gift Details & Description
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm whitespace-pre-line">
                {product.description}
              </p>
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

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 px-8 rounded-full font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300 shadow-none'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:scale-102 active:scale-98'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                </button>

                <Link
                  to="/cart"
                  className="py-4 px-6 rounded-full font-bold text-sm text-stone-700 bg-stone-100 hover:bg-stone-200 text-center transition-colors"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>

          {/* Value Badges */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-3">
            <div className="flex items-center space-x-3 text-xs text-stone-600">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Express delivery with delicate gift crate handling</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-600">
              <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Complimentary handwritten greeting card option at checkout</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-stone-600">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>100% Quality guarantee on every item</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
