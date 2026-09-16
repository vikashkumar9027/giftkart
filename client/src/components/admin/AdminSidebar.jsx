import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  LogOut,
  Gift,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Gallery CMS', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Banners & Offers', path: '/admin/banners', icon: Sliders },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const content = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300 w-64 border-r border-stone-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-stone-800">
        <Link to="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white tracking-tight">
              GiftNest
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full">
              Admin CMS
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
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950 font-semibold'
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

      {/* Admin User Info & Quick Actions */}
      <div className="p-4 border-t border-stone-800 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
        >
          <span>View Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white truncate">
              {user?.name || 'Administrator'}
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
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

export default AdminSidebar;
