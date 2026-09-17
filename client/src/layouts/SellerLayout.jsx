import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SellerSidebar from '../components/seller/SellerSidebar';
import SellerHeader from '../components/seller/SellerHeader';

const SellerLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, send to login
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=seller" state={{ from: location }} replace />;
  }

  // If logged in as customer, prompt to register as seller
  if (user?.role !== 'seller' && user?.role !== 'admin') {
    return <Navigate to="/become-seller" replace />;
  }

  // Derive current page title from pathname
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/seller/dashboard')) return 'Seller Operations Hub';
    if (path.includes('/seller/products')) return 'Product Catalog & Inventory';
    if (path.includes('/seller/orders')) return 'Order Fulfillment & Dispatch';
    return 'Seller Portal';
  };

  return (
    <div className="min-h-screen flex bg-stone-100 font-sans">
      <SellerSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SellerHeader title={getTitle()} onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
