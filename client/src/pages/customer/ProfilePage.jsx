import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Calendar, Package, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setProfileData(res.data.user);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        } finally {
          setFetching(false);
        }
      }
    };
    fetchMe();
  }, [isAuthenticated]);

  if (loading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=profile" replace />;
  }

  const currentUser = profileData || user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">My Customer Account</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal profile and view your gifting history.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center px-5 py-2.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors w-fit"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </button>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-stone-100 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-rose-600 text-white font-serif font-bold text-3xl flex items-center justify-center shadow-lg shadow-rose-200">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold font-serif text-stone-900">
                {currentUser?.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                {currentUser?.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>
            <p className="text-xs text-stone-400">{currentUser?.email}</p>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-semibold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-rose-600" />
              <span>Registered Email</span>
            </div>
            <p className="text-sm font-bold text-stone-800 break-all">{currentUser?.email}</p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Account Member Since</span>
            </div>
            <p className="text-sm font-bold text-stone-800">
              {formatDate(currentUser?.createdAt)}
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-1">
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-semibold uppercase tracking-wider">
              <Package className="w-4 h-4 text-rose-600" />
              <span>Total Gifting Orders</span>
            </div>
            <p className="text-2xl font-extrabold text-stone-900 font-serif">
              {currentUser?.orderCount ?? 0}
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Quick Navigation</span>
            </div>
            <div className="pt-2">
              <Link
                to="/orders"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4"
              >
                View Your Order History →
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Link if role is admin */}
        {currentUser?.role === 'admin' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-amber-900">Administrator Privileges Active</p>
                <p className="text-[11px] text-amber-700">
                  You have authorized access to manage products, categories, orders, banners, and gallery.
                </p>
              </div>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition-colors shrink-0"
            >
              Open Admin Portal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
