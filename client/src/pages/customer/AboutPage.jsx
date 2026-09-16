import React from 'react';
import { Gift, Heart, Sparkles, Award, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
          <Heart className="w-3.5 h-3.5" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
          Bringing Thoughtful Elegance to Every Gift
        </h1>
        <p className="text-stone-500 leading-relaxed text-sm sm:text-base">
          GiftNest was founded with a simple yet profound conviction: giving a gift is never just about the
          item itself—it is about the unspoken warmth, memory, and gratitude it kindles between human hearts.
        </p>
      </div>

      {/* Feature visual banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-16/9 max-h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1600&q=80"
          alt="Gift studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
          <p className="text-white font-serif text-xl sm:text-2xl max-w-lg font-light italic">
            "We don't simply wrap boxes; we package emotion, joy, and memories meant to last forever."
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Artisan Sourced</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every product in our crates is sourced from independent makers, master chocolatiers, and
            ethical craftsmen who pour pride into every batch.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Bespoke Touch</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            From hand-tied satin ribbons to calligraphy-embossed greeting cards, your gift arrives looking
            immaculately presented.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">100% Guaranteed</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            If anything about your recipient's experience is less than pure delight, our dedicated team will
            replace or refund your order immediately.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5">
        <h2 className="text-3xl font-serif font-bold">Ready to Surprise Someone Special?</h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
          Explore our birthday crates, anniversary treasures, and custom keepsakes.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-lg shadow-rose-900 transition-all hover:scale-105"
        >
          Explore GiftNest Catalog
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
