import React from 'react';
import { Menu, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerHeader = ({ title, onMenuToggle }) => {
  const { user } = useAuth();
  const storeName = user?.sellerProfile?.storeName || 'Seller Hub';

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">{title}</h1>
          <p className="text-xs text-stone-500 hidden sm:block">
            Flipkart-Style Merchant Center & Product Operations
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5 bg-blue-50 py-1.5 px-3 rounded-full border border-blue-200">
          <Store className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-stone-800">
            {storeName}
          </span>
          <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
            Seller
          </span>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
