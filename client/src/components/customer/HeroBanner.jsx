import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';
import api from '../../services/api';

const defaultBanners = [
  {
    title: 'Celebrate Every Story with Handcrafted Gifts',
    subtitle: 'Thoughtfully curated luxury gift boxes, everlasting preserved flowers, and bespoke personalized treasures for the ones you cherish.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1800&q=80',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    title: 'Timeless Anniversary Keepsakes & Romance',
    subtitle: 'From gilded champagne flutes to custom wooden memories, honor your milestone with unforgettable elegance.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1800&q=80',
    buttonText: 'Explore Gifts',
    buttonLink: '/shop?category=anniversary',
  },
];

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get('/banners');
        if (res.data.success && res.data.banners.length > 0) {
          setBanners(res.data.banners);
        } else {
          setBanners(defaultBanners);
        }
      } catch (err) {
        console.warn('Failed to load dynamic banners, using fallback:', err);
        setBanners(defaultBanners);
      }
    };
    fetchBanners();
  }, []);

  // Auto slide carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanner = banners[currentIndex] || defaultBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl">
      {/* Background Banner Image */}
      <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center">
        <img
          key={activeBanner.image}
          src={activeBanner.image}
          alt={activeBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in filter brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />

        {/* Banner Content Container */}
        <div className="relative z-10 max-w-3xl px-6 sm:px-12 lg:px-16 py-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-rose-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Premium Gifting Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
            {activeBanner.title}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-200 leading-relaxed max-w-xl font-light">
            {activeBanner.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to={activeBanner.buttonLink || '/shop'}
              className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>{activeBanner.buttonText || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm border border-white/30 hover:border-white/50 transition-all"
            >
              Explore Gifts
            </Link>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 right-8 z-10 flex items-center space-x-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-stone-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors border border-white/10"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-stone-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors border border-white/10"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Feature Badges Footer */}
      <div className="bg-stone-950/80 backdrop-blur-md border-t border-stone-800/80 px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-stone-300">
        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <Truck className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Complimentary Express Delivery Over $50</span>
        </div>
        <div className="flex items-center space-x-3 justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Safe & Secure Artisanal Packaging</span>
        </div>
        <div className="flex items-center space-x-3 justify-center sm:justify-end">
          <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Handwritten Personalized Cards</span>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
