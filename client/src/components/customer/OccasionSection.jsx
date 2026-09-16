import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/LoadingSkeleton';

const occasions = [
  { id: 'Birthday', label: 'Birthday Gifts', emoji: '🎂' },
  { id: 'Anniversary', label: 'Anniversary Gifts', emoji: '💍' },
  { id: 'Wedding', label: 'Wedding Gifts', emoji: '💒' },
  { id: 'Festival', label: 'Festival Gifts', emoji: '🪔' },
  { id: 'Corporate', label: 'Corporate Gifts', emoji: '💼' },
];

const OccasionSection = () => {
  const [activeOccasion, setActiveOccasion] = useState('Birthday');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasionProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?occasion=${activeOccasion}&limit=4`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load occasion gifts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOccasionProducts();
  }, [activeOccasion]);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Gifts by Occasion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Find the Perfect Gift for Every Celebration
          </h2>
          <p className="mt-2 text-sm text-stone-500 max-w-xl">
            Celebrate life’s unforgettable chapters with gifts curated specifically for each special moment.
          </p>
        </div>

        <Link
          to={`/shop?occasion=${encodeURIComponent(activeOccasion)}`}
          className="inline-flex items-center text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <span>View all {activeOccasion} gifts</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      {/* Occasion Tabs */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 scrollbar-none mb-8">
        {occasions.map((occ) => {
          const isActive = activeOccasion === occ.id;
          return (
            <button
              key={occ.id}
              onClick={() => setActiveOccasion(occ.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{occ.emoji}</span>
              <span>{occ.label}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
          <p className="text-stone-500 text-sm">No gifts found for this occasion right now.</p>
          <Link
            to="/shop"
            className="mt-4 inline-block px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-full"
          >
            Browse All Gifts
          </Link>
        </div>
      )}
    </section>
  );
};

export default OccasionSection;
