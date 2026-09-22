import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';

const FloatingCartBar = () => {
  const { totalItems, subtotal, cartItems } = useCart();
  const location = useLocation();

  // Hide on cart, checkout, or auth pages where a bottom cart overlay would be redundant
  const hideRoutes = ['/cart', '/checkout', '/login', '/register'];
  const shouldHide = hideRoutes.includes(location.pathname) || totalItems <= 0;

  if (shouldHide) return null;

  // Most recently added item thumbnail
  const lastItem = cartItems[cartItems.length - 1];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] z-50 animate-fade-in">
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white rounded-2xl px-3 py-2.5 sm:p-3.5 shadow-2xl shadow-stone-950/40 border border-white/15 flex items-center justify-between gap-2.5 sm:gap-3 backdrop-blur-md">
        {/* Left: Item count, Subtotal & Delivery Status */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            {lastItem?.image ? (
              <img
                src={lastItem.image}
                alt={lastItem.name}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-white/20 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
            )}
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-extrabold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-stone-900 shadow-xs">
              {totalItems}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight shrink-0 leading-none">
                {formatINR(subtotal)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 whitespace-nowrap bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded leading-none shrink-0">
                {subtotal >= 499 ? 'Free Delivery' : '+₹40 delivery'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300 truncate mt-1 leading-tight">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {/* Right: Checkout CTA button */}
        <Link
          to="/cart"
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-rose-600/30 whitespace-nowrap"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default FloatingCartBar;
