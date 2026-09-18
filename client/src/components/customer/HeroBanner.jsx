import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Truck, ShieldCheck, Heart, Headphones, Sparkles, ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const occasionChips = [
    { label: '🎂 Birthday', link: '/shop?occasion=Birthday' },
    { label: '❤️ Anniversary', link: '/shop?occasion=Anniversary' },
    { label: '🌹 Flowers', link: '/shop?category=flowers' },
    { label: '🍫 Chocolates', link: '/shop?category=chocolates' },
    { label: '🎁 Personalized', link: '/shop?occasion=Personalised' },
  ];

  const trustFeatures = [
    {
      icon: Truck,
      iconBg: 'bg-rose-100 text-rose-600',
      title: 'Free Delivery',
      subtitle: 'On orders over ₹499',
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-purple-100 text-purple-600',
      title: 'Secure Payments',
      subtitle: '100% safe checkout',
    },
    {
      icon: Heart,
      iconBg: 'bg-emerald-100 text-emerald-600',
      title: 'Curated with Love',
      subtitle: 'Handpicked quality gifts',
    },
    {
      icon: Headphones,
      iconBg: 'bg-amber-100 text-amber-600',
      title: '24/7 Support',
      subtitle: "We're here to help anytime",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
      {/* Main Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#d91b5c] via-[#eb3349] to-[#f45c43] text-white shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Background decorative ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Headline, Subtitle, CTAs, Occasion Chips, Search */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/25 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-white tracking-wide border border-white/30 shadow-xs">
              <span>Special Gifts</span>
              <span className="text-rose-200">♥</span>
              <span>Bigger Smiles</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Find a Gift They&apos;ll Love
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-rose-50/95 font-medium leading-relaxed max-w-xl">
              Thoughtful gifts for birthdays, anniversaries and every special moment.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center space-x-2 px-6 sm:px-7 py-3 rounded-full bg-white text-rose-600 hover:text-rose-700 font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-900/20 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
              >
                <span>🎁 Explore Gifts →</span>
              </Link>
              <Link
                to="/gifts"
                className="inline-flex items-center justify-center space-x-2 px-6 sm:px-7 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm border border-white/40 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>✨ Smart Gift Wizard ✨</span>
              </Link>
            </div>

            {/* Occasion Chips Row */}
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {occasionChips.map((chip) => (
                  <Link
                    key={chip.label}
                    to={chip.link}
                    className="inline-flex items-center bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/25 shadow-xs transition-all cursor-pointer"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Integrated Rounded Search Pill */}
            <div className="pt-2 max-w-xl">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-2xl transition-all focus-within:ring-4 focus-within:ring-white/40"
              >
                <Search className="w-5 h-5 text-stone-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts, flowers, cakes..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-stone-900 bg-transparent outline-none placeholder:text-stone-400 font-medium"
                />
                <button
                  type="submit"
                  className="shrink-0 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-extrabold rounded-full shadow-md shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: 3D Festive Gifts Composition Image */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] group">
              {/* Subtle ambient backglow */}
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform scale-90 -z-10" />
              <img
                src="/hero-gift-composition.png"
                alt="Curated festive gifts and celebrations"
                className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars Feature Strip (4 cards exactly from reference mockup) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {trustFeatures.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex items-center space-x-3"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default HeroBanner;
