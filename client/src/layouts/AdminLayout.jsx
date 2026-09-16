import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Strict Admin Guard: Reject unauthenticated or customer users
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Derive current page title from pathname
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Dashboard Overview';
    if (path.includes('/admin/products')) return 'Product Management';
    if (path.includes('/admin/categories')) return 'Category Management';
    if (path.includes('/admin/orders')) return 'Order Operations';
    if (path.includes('/admin/delivery')) return 'Delivery & Courier Operations';
    if (path.includes('/admin/gallery')) return 'Gallery CMS';
    if (path.includes('/admin/banners')) return 'Banners & Promotions';
    return 'Admin CMS';
  };

  return (
    <div className="min-h-screen flex bg-stone-100 font-sans">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader title={getTitle()} onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
