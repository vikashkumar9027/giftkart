import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  ExternalLink,
  LogOut,
  Store,
  X,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: 'Seller Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'My Catalog & Products', path: '/seller/products', icon: Package },
    { name: 'Orders to Dispatch', path: '/seller/orders', icon: Truck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const storeName = user?.sellerProfile?.storeName || 'My Marketplace Store';
  const gstin = user?.sellerProfile?.gstin || '29AABCU9603R1ZM';
  const rating = user?.sellerProfile?.rating || 4.8;

  const content = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300 w-64 border-r border-stone-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-stone-800">
        <Link to="/seller/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-950">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white tracking-tight">
              GiftNest
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
              Seller Hub
            </span>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Seller Profile Mini Card */}
      <div className="mx-4 mt-4 p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white truncate max-w-[130px]" title={storeName}>
            {storeName}
          </span>
          <div className="inline-flex items-center bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            <span>{rating}</span>
            <Star className="w-2.5 h-2.5 ml-0.5 fill-white" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-stone-400">
          <span className="font-mono truncate max-w-[140px]">{gstin}</span>
          <span className="text-blue-400 font-semibold flex items-center">
            <ShieldCheck className="w-3 h-3 mr-0.5" />
            Verified
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-semibold'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Store Link & Logout */}
      <div className="p-4 border-t border-stone-800 space-y-3">
        <Link
          to="/shop"
          target="_blank"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
        >
          <span>View Buyer Marketplace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white truncate">
              {user?.name || 'Seller Account'}
            </span>
            <span className="text-[11px] text-stone-500 truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex-1 max-w-xs w-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSidebar;
