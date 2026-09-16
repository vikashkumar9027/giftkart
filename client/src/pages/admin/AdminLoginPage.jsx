import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user?.role !== 'admin') {
          setError('Access Denied: Your account does not have administrator privileges.');
          setLoading(false);
          return;
        }

        showToast('Admin authorization confirmed. Welcome to CMS!', 'success');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setError(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@giftnest.com');
    setPassword('Admin@12345');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-stone-950 p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl text-stone-200 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            GiftNest Admin CMS
          </h2>
          <p className="text-xs text-stone-400">
            Secure administrative control portal for products, orders, and content.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-3.5 rounded-2xl flex items-center space-x-2.5 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@giftnest.com"
                className="w-full pl-10 pr-4 py-3 bg-stone-900 rounded-2xl border border-stone-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-900 rounded-2xl border border-stone-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-950 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Authorize & Enter CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="bg-stone-900/80 rounded-2xl p-4 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Evaluator Quick Access
            </span>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] text-stone-400 font-mono space-y-0.5">
            <p>Email: admin@giftnest.com</p>
            <p>Password: Admin@12345</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center text-xs text-stone-400 hover:text-stone-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
