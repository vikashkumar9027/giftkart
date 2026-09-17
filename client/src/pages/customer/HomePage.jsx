import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Gift, Award, Clock, HeartHandshake } from 'lucide-react';
import api from '../../services/api';
import HeroBanner from '../../components/customer/HeroBanner';
import CategoryCard from '../../components/customer/CategoryCard';
import ProductCard from '../../components/customer/ProductCard';
import OccasionSection from '../../components/customer/OccasionSection';
import GallerySection from '../../components/customer/GallerySection';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, featuredRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
        ]);

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories);
        }
        if (featuredRes.data.success) {
          setFeaturedProducts(featuredRes.data.products);
        }
      } catch (err) {
        console.error('Failed to load homepage resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 1.5 Quick Occasion Ribbon - Dedicated Gifting Shortcut */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-stone-100/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Dedicated Gift Options</span>
            </div>
            <Link
              to="/gifts"
              className="text-xs font-bold text-stone-700 hover:text-rose-600 flex items-center space-x-1"
            >
              <span>Launch Smart Gift Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <Link
              to="/gifts?occasion=Birthday"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-rose-50/50 to-white hover:to-rose-50/80 border border-rose-100 hover:border-rose-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">🎂</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-rose-600">Birthday Gifts</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Surprise &amp; cheer</span>
            </Link>

            <Link
              to="/gifts?occasion=Anniversary"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white hover:to-amber-50/80 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">💍</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-amber-600">Anniversary</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Couple keepsakes</span>
            </Link>

            <Link
              to="/gifts?occasion=Wedding"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-purple-50/50 to-white hover:to-purple-50/80 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">💒</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-purple-600">Wedding Gifts</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Royal &amp; blessed</span>
            </Link>

            <Link
              to="/gifts?occasion=Valentine"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-pink-50/50 to-white hover:to-pink-50/80 border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">💖</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-pink-600">Romance &amp; Love</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Roses &amp; pendants</span>
            </Link>

            <Link
              to="/gifts?occasion=Festival"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-orange-50/50 to-white hover:to-orange-50/80 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">🪔</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-orange-600">Diwali &amp; Festive</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Dry fruits &amp; sweets</span>
            </Link>

            <Link
              to="/gifts?occasion=Personalised"
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white hover:to-emerald-50/80 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">✂️</span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-600">Personalised</span>
              <span className="text-[10px] text-stone-400 mt-0.5">Custom engraved</span>
            </Link>

            <Link
              to="/gifts"
              className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-stone-900 hover:bg-rose-600 text-white shadow-md hover:shadow-rose-200 transition-all text-center col-span-2 sm:col-span-2 lg:col-span-1"
            >
              <span className="text-2xl sm:text-3xl mb-1">🎁</span>
              <span className="text-xs sm:text-sm font-bold">Gift Studio</span>
              <span className="text-[10px] text-white/70 mt-0.5">Custom Wizard →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Gift Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-4 h-4" />
              <span>Explore by Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Curated Gift Categories
            </h2>
            <p className="mt-2 text-sm text-stone-500 max-w-xl">
              From jubilant birthday surprises to refined executive hampers, discover tokens that make
              every recipient smile.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Featured Gifts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              Featured Gifts
            </h2>
            <p className="mt-2 text-sm text-stone-500 max-w-xl">
              Our most celebrated and beloved gifting choices, crafted with premium materials and
              exceptional presentation.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Occasion Section */}
      <OccasionSection />

      {/* 5. Trust & Quality Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">Artisanal Craftsmanship</h4>
              <p className="text-xs text-rose-200/80 mt-1">Every box is hand-packed with bespoke silk ribbons and custom greeting notes.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7 text-rose-300" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">Guaranteed Delivery</h4>
              <p className="text-xs text-rose-200/80 mt-1">Select your preferred date during checkout for timely surprise delivery.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">Happiness Guaranteed</h4>
              <p className="text-xs text-rose-200/80 mt-1">100% satisfaction promise. We make sure every gifting experience is magical.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Gallery CMS Section */}
      <GallerySection />
    </div>
  );
};

export default HomePage;
