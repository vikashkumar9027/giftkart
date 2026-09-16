import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const CartPage = () => {
  const { cartItems, totalItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Free shipping threshold
  const freeShippingThreshold = 50;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 7.99;
  const grandTotal = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Your Gifting Cart is Empty
        </h1>
        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven't selected any curated gifts yet. Explore our artisanal collection and
          find something truly special today.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-200 transition-all hover:scale-105"
        >
          <span>Start Gifting</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Shopping Cart</h1>
          <p className="text-xs text-stone-500 mt-1">
            You have <span className="font-bold text-stone-800">{totalItems}</span> items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      {/* Cart Grid: Items table & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Cart Items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const isMaxStock = item.quantity >= item.stock;

            return (
              <div
                key={item.product}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 transition-all"
              >
                {/* Product Image & Title */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      className="text-sm font-bold text-stone-900 hover:text-rose-600 transition-colors line-clamp-1 font-serif"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Unit Price: {formatCurrency(item.price)}
                    </p>
                    {isMaxStock && (
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                        Max available stock limit ({item.stock})
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                  {/* Quantity +- */}
                  <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      disabled={isMaxStock}
                      className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for this product */}
                  <span className="text-sm font-bold text-stone-900 min-w-[70px] text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center justify-between text-xs">
            <Link
              to="/shop"
              className="inline-flex items-center font-bold text-rose-600 hover:text-rose-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-serif font-bold text-xl text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Delivery & Handling</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              {subtotal < freeShippingThreshold && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Add <strong>{formatCurrency(freeShippingThreshold - subtotal)}</strong> more of
                  curated gifts for <strong>Free Delivery</strong>!
                </p>
              )}

              <div className="border-t border-stone-100 pt-3 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-rose-600 text-xl font-extrabold font-serif">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login?redirect=checkout');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full py-4 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust highlights */}
            <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-500">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Express courier tracking included</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero transaction fees (Direct payment)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
