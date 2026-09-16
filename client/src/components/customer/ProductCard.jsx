import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isOutOfStock = product.stock <= 0;
  const mainImage =
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';

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
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Badge */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-rose-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-md shadow-rose-900/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </span>
        )}

        {/* Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
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
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <Link
            to={`/product/${product._id}`}
            className="bg-white/95 text-stone-900 hover:text-rose-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1.5 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5 font-medium">
            <span className="text-rose-600 font-semibold tracking-wide uppercase text-[10px]">
              {product.category?.name || 'Curated Gift'}
            </span>
            <span className="bg-stone-100 px-2 py-0.5 rounded-md text-[10px] text-stone-600">
              {product.occasion || 'General'}
            </span>
          </div>

          <Link to={`/product/${product._id}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="text-base font-bold text-stone-900 line-clamp-1 font-serif">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block font-sans">Price</span>
            <span className="text-lg font-extrabold text-stone-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:shadow-md hover:scale-102 active:scale-98'
            }`}
            title={isOutOfStock ? 'Product is currently sold out' : 'Add to shopping cart'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
