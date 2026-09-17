import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gift,
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  ShieldAlert,
  ChevronDown,
  Truck,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [giftsDropdownOpen, setGiftsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isSeller = user?.role === 'seller';
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'Track Order', path: '/track' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-xs transition-all">
      {/* Top Banner Bar - Indian Gifting & Shopping Promotion */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        ✨ Free Express Delivery across India on orders above ₹499 | Cash on Delivery & Instant UPI available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-rose-700 transition-colors">
                GiftNest
              </span>
              <span className="text-[10px] tracking-widest uppercase text-stone-400 font-semibold -mt-1">
                Curated Surprises
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Dedicated Gift Options Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                location.pathname === '/' ? 'text-rose-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Home
            </Link>

            {/* Dedicated Gift Options Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGiftsDropdownOpen(true)}
              onMouseLeave={() => setGiftsDropdownOpen(false)}
            >
              <Link
                to="/gifts"
                className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                  location.pathname.startsWith('/gifts') || location.pathname.startsWith('/occasions')
                    ? 'bg-rose-600 text-white shadow-rose-200'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Gift Options</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </Link>

              {giftsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-3xl shadow-xl border border-stone-200 p-3 space-y-1 z-50 animate-fade-in text-xs font-semibold text-stone-700">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 border-b border-stone-100">
                    Gifts by Milestone Celebration
                  </div>
                  <Link
                    to="/gifts?occasion=Birthday"
                    onClick={() => setGiftsDropdownOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <span className="text-xl">🎂</span>
                    <div>
                      <div className="font-bold text-stone-900">Birthday Gifts</div>
                      <div className="text-[10px] text-stone-400 font-normal">Hampers, electronics &amp; surprises</div>
                    </div>
                  </Link>
                  <Link
                    to="/gifts?occasion=Anniversary"
                    onClick={() => setGiftsDropdownOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <span className="text-xl">💍</span>
                    <div>
                      <div className="font-bold text-stone-900">Anniversary Gifts</div>
                      <div className="text-[10px] text-stone-400 font-normal">Watches, silk sarees &amp; romantic boxes</div>
                    </div>
                  </Link>
                  <Link
                    to="/gifts?occasion=Wedding"
                    onClick={() => setGiftsDropdownOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <span className="text-xl">💒</span>
                    <div>
                      <div className="font-bold text-stone-900">Wedding &amp; Reception</div>
                      <div className="text-[10px] text-stone-400 font-normal">Royal brassware &amp; heritage weavings</div>
                    </div>
                  </Link>
                  <Link
                    to="/gifts?occasion=Festival"
                    onClick={() => setGiftsDropdownOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <span className="text-xl">🪔</span>
                    <div>
                      <div className="font-bold text-stone-900">Festive &amp; Diwali</div>
                      <div className="text-[10px] text-stone-400 font-normal">Kashmiri saffron &amp; sweet hampers</div>
                    </div>
                  </Link>
                  <div className="pt-2 border-t border-stone-100 mt-1">
                    <Link
                      to="/gifts"
                      onClick={() => setGiftsDropdownOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-900 text-white font-bold hover:bg-black transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <span>🔍</span>
                        <span>Smart Gift Finder Wizard</span>
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Explore →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                location.pathname === '/shop' ? 'text-rose-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Shop All
            </Link>

            <Link
              to="/track"
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                location.pathname === '/track' ? 'text-rose-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Track Order
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                location.pathname === '/about' ? 'text-rose-600 font-semibold' : 'text-stone-600'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                location.pathname === '/contact' ? 'text-rose-600 font-semibold' : 'text-stone-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Trigger (Desktop) */}
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gifts, flowers, hampers..."
                    autoFocus
                    className="w-64 px-4 py-2 text-sm bg-stone-100 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Flipkart-Style Become a Seller / Seller Hub Button */}
            <Link
              to={isSeller ? "/seller/dashboard" : "/become-seller"}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 hover:text-rose-600 hover:bg-stone-100 transition-colors border border-stone-200"
              title={isSeller ? "Merchant Operations Hub" : "Start Selling on GiftNest Marketplace"}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>{isSeller ? "Seller Hub" : "Become a Seller"}</span>
            </Link>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[11px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-stone-100 border border-stone-200 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline-block text-xs font-semibold text-stone-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:inline-block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-xs text-stone-400">Signed in as</p>
                      <p className="text-sm font-bold text-stone-800 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      {isSeller && (
                        <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Verified Seller • {user?.sellerProfile?.storeName || 'Merchant'}
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3 text-stone-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <Package className="w-4 h-4 mr-3 text-stone-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/track"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <Truck className="w-4 h-4 mr-3 text-stone-400" />
                      Track Shipment
                    </Link>

                    {isSeller && (
                      <Link
                        to="/seller/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors font-medium"
                      >
                        <Store className="w-4 h-4 mr-3 text-emerald-600" />
                        Seller Hub
                      </Link>
                    )}

                    {!isSeller && !isAdmin && (
                      <Link
                        to="/become-seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors font-medium"
                      >
                        <Store className="w-4 h-4 mr-3 text-amber-600" />
                        Become a Seller
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-amber-700 bg-amber-50/60 hover:bg-amber-100 transition-colors font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 mr-3 text-amber-600" />
                        Admin Portal
                      </Link>
                    )}

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-stone-700 hover:text-rose-600 transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors px-4 py-2 rounded-full shadow-sm shadow-rose-200"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 md:hidden rounded-lg"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts, flowers, occasions..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </form>

          {/* Nav Links */}
          <div className="flex flex-col space-y-2 pt-2">
            {/* Dedicated Gift Options Button / Highlight */}
            <Link
              to="/gifts"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-rose-700 font-bold rounded-xl shadow-xs"
            >
              <span className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-rose-600" />
                <span>🎁 Gifting Studio &amp; Occasions</span>
              </span>
              <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Explore</span>
            </Link>

            {/* Quick Occasions Grid in Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2 px-1">
              <Link
                to="/gifts?occasion=Birthday"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs p-2 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-700 font-medium flex items-center space-x-1.5 border border-stone-100"
              >
                <span>🎂</span>
                <span>Birthday Gifts</span>
              </Link>
              <Link
                to="/gifts?occasion=Anniversary"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs p-2 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-700 font-medium flex items-center space-x-1.5 border border-stone-100"
              >
                <span>💍</span>
                <span>Anniversary</span>
              </Link>
              <Link
                to="/gifts?occasion=Wedding"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs p-2 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-700 font-medium flex items-center space-x-1.5 border border-stone-100"
              >
                <span>💒</span>
                <span>Wedding</span>
              </Link>
              <Link
                to="/gifts?occasion=Festival"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs p-2 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-700 font-medium flex items-center space-x-1.5 border border-stone-100"
              >
                <span>🪔</span>
                <span>Diwali &amp; Festive</span>
              </Link>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-stone-50 rounded-xl">
                  <p className="text-xs text-stone-400">Signed in as</p>
                  <p className="text-sm font-bold text-stone-800">{user?.name}</p>
                  <p className="text-xs text-stone-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl"
                >
                  <User className="w-4 h-4 mr-3 text-stone-400" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl"
                >
                  <Package className="w-4 h-4 mr-3 text-stone-400" />
                  My Orders
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl"
                >
                  <Truck className="w-4 h-4 mr-3 text-stone-400" />
                  Track Shipment
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-amber-700 bg-amber-50 rounded-xl font-medium"
                  >
                    <ShieldAlert className="w-4 h-4 mr-3 text-amber-600" />
                    Admin CMS
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl text-left"
                >
                  <LogOut className="w-4 h-4 mr-3 text-rose-500" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 bg-rose-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-rose-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
