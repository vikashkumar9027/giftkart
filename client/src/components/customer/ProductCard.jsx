import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isOutOfStock = product.stock <= 0;
  const mainImage =
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';

  const discount = calculateDiscount(product.mrp, product.price);
  const rating = product.rating || 4.5;
  const ratingsCount = product.ratingsCount || 120;
  const sellerName = product.seller?.sellerProfile?.storeName || product.seller?.name;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const result = addToCart(product, 1);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-50">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isFeatured && (
            <span className="bg-rose-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
            isOutOfStock
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : product.stock <= 5
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : product.stock <= 5
            ? `Only ${product.stock} left`
            : 'In Stock'}
        </span>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <Link
            to={`/product/${product._id}`}
            className="bg-white text-stone-900 hover:text-rose-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1.5 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Assured Badge */}
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
            <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px]">
              {product.category?.name || 'Curated'}
            </span>
            {product.isAssured !== false && (
              <span className="inline-flex items-center text-[10px] font-black italic text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200" title="NestAssured Quality Verified">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-blue-600" />
                Nest<span className="text-amber-500">Assured</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/product/${product._id}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Reviews (Flipkart Style) */}
          <div className="mt-1.5 flex items-center space-x-2">
            <div className="inline-flex items-center bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 ml-0.5 fill-white" />
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              ({ratingsCount.toLocaleString('en-IN')})
            </span>
            {sellerName && (
              <span className="text-[10px] text-stone-400 truncate max-w-[110px] hidden sm:inline" title={`Sold by ${sellerName}`}>
                • {sellerName}
              </span>
            )}
          </div>

          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              {discount > 0 && (
                <span className="text-[11px] font-bold text-emerald-600">
                  {discount}% off
                </span>
              )}
              <span className="text-[10px] text-stone-400">
                {product.price >= 499 ? 'Free Delivery' : '+ ₹40 Delivery'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:shadow-md active:scale-95'
            }`}
            title={isOutOfStock ? 'Product is sold out' : 'Add to Cart'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
