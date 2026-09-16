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
