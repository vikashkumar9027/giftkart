import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Gift,
  Sparkles,
  Heart,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  SlidersHorizontal,
  Cake,
  Award,
  Users,
  IndianRupee,
} from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';

const occasionOptions = [
  { id: 'all', label: 'All Gifts', emoji: '🎁', tag: 'Curated' },
  { id: 'Birthday', label: 'Birthday Gifts', emoji: '🎂', tag: 'Cakes & Hampers' },
  { id: 'Anniversary', label: 'Anniversary Gifts', emoji: '💍', tag: 'Romance & Watches' },
  { id: 'Wedding', label: 'Wedding Gifts', emoji: '💒', tag: 'Silks & Silverware' },
  { id: 'Festival', label: 'Festive & Diwali', emoji: '🪔', tag: 'Dry Fruits & Sweets' },
  { id: 'Personalised', label: 'Personalised Keepsakes', emoji: '✂️', tag: 'Engraved & Custom' },
  { id: 'Corporate', label: 'Corporate & Executive', emoji: '💼', tag: 'Desk & Audio' },
];

const recipientOptions = [
  { id: 'all', label: 'Anyone / Everyone', icon: '🌟' },
  { id: 'For Her', label: 'For Her (Wife, Mother, Sister)', icon: '👩' },
  { id: 'For Him', label: 'For Him (Husband, Father, Brother)', icon: '👨' },
  { id: 'Couples', label: 'For Couples & Parents', icon: '💑' },
  { id: 'Kids', label: 'For Kids & Teens', icon: '🧸' },
];

const budgetOptions = [
  { id: 'all', label: 'Any Budget', min: 0, max: 999999 },
  { id: 'under_999', label: 'Under ₹999', min: 0, max: 999 },
  { id: '1000_2499', label: '₹1,000 – ₹2,499', min: 1000, max: 2499 },
  { id: '2500_4999', label: '₹2,500 – ₹4,999', min: 2500, max: 4999 },
  { id: 'luxury', label: 'Luxury (₹5,000+)', min: 5000, max: 999999 },
];

const GiftStudioPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOccasion = searchParams.get('occasion') || 'all';
  const initialRecipient = searchParams.get('recipient') || 'all';
  const initialBudget = searchParams.get('budget') || 'all';

  // Wizard state
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedRecipient, setSelectedRecipient] = useState(initialRecipient);
  const [selectedBudget, setSelectedBudget] = useState(initialBudget);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Birthday & Anniversary Curated Subsets
  const [birthdayGifts, setBirthdayGifts] = useState([]);
  const [anniversaryGifts, setAnniversaryGifts] = useState([]);

  const resultsRef = useRef(null);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('occasion')) setSelectedOccasion(searchParams.get('occasion'));
    if (searchParams.get('recipient')) setSelectedRecipient(searchParams.get('recipient'));
    if (searchParams.get('budget')) setSelectedBudget(searchParams.get('budget'));
  }, [searchParams]);

  // Fetch filtered gifts
  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedOccasion && selectedOccasion !== 'all') {
          params.append('occasion', selectedOccasion);
        }

        const currentBudgetObj = budgetOptions.find((b) => b.id === selectedBudget);
        if (currentBudgetObj && currentBudgetObj.id !== 'all') {
          if (currentBudgetObj.min > 0) params.append('minPrice', currentBudgetObj.min);
          if (currentBudgetObj.max < 999999) params.append('maxPrice', currentBudgetObj.max);
        }

        params.append('limit', 24);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          let list = res.data.products;

          // Client side recipient keyword match if selected
          if (selectedRecipient && selectedRecipient !== 'all') {
            const rTerm = selectedRecipient.toLowerCase();
            list = list.filter((item) => {
              const text = `${item.name} ${item.description} ${item.occasion || ''}`.toLowerCase();
              if (rTerm.includes('her')) {
                return text.includes('saree') || text.includes('fragrance') || text.includes('women') || text.includes('rose') || text.includes('spa') || text.includes('shawl') || text.includes('chocolate');
              }
              if (rTerm.includes('him')) {
                return text.includes('watch') || text.includes('earbuds') || text.includes('kurta') || text.includes('men') || text.includes('speaker');
              }
              return true;
            });
          }

          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching gifts in GiftStudio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [selectedOccasion, selectedRecipient, selectedBudget]);

  // Fetch standalone Birthday & Anniversary rows
  useEffect(() => {
    const fetchSpecialOccasions = async () => {
      try {
        const [bRes, aRes] = await Promise.all([
          api.get('/products?occasion=Birthday&limit=4'),
          api.get('/products?occasion=Anniversary&limit=4'),
        ]);

        if (bRes.data.success) setBirthdayGifts(bRes.data.products);
        if (aRes.data.success) setAnniversaryGifts(aRes.data.products);
      } catch (err) {
        console.error('Failed to load featured birthday/anniversary sets:', err);
      }
    };

    fetchSpecialOccasions();
  }, []);

  const handleOccasionSelect = (occId) => {
    setSelectedOccasion(occId);
    const newParams = new URLSearchParams(searchParams);
    if (occId !== 'all') newParams.set('occasion', occId);
    else newParams.delete('occasion');
    setSearchParams(newParams);
  };

  const resetFinder = () => {
    setSelectedOccasion('all');
    setSelectedRecipient('all');
    setSelectedBudget('all');
    setSearchParams({});
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Dedicated Gifting Studio Hero Banner */}
      <div className="relative bg-gradient-to-br from-rose-950 via-stone-900 to-rose-900 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        {/* Subtle Decorative Background Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold px-4 py-1.5 rounded-full shadow-inner">
            <Gift className="w-4 h-4 text-rose-300" />
            <span>Dedicated Gifting Studio • Gifts for Every Milestone</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Celebrate Unforgettable Moments with Curated Gifts
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            From joyful birthdays to cherished anniversaries, luxury festive hampers, and personalized keepsakes—find the perfect token crafted with love, velvet packaging, and handwritten cards.
          </p>

          {/* Quick Jump Occasion Pills in Hero */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {occasionOptions.slice(1).map((occ) => (
              <button
                key={occ.id}
                onClick={() => handleOccasionSelect(occ.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedOccasion === occ.id
                    ? 'bg-rose-600 text-white ring-2 ring-rose-300 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15'
                }`}
              >
                <span>{occ.emoji}</span>
                <span>{occ.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive 3-Step Smart Gift Finder Wizard */}
      <div id="finder" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
            <div>
              <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Smart Gift Finder Wizard</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                Find the Perfect Gift in 3 Easy Steps
              </h2>
            </div>

            {(selectedOccasion !== 'all' || selectedRecipient !== 'all' || selectedBudget !== 'all') && (
              <button
                onClick={resetFinder}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline self-start sm:self-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Step 1: Select Occasion */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Step 1: Choose the Celebration / Occasion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {occasionOptions.map((occ) => {
                  const isSelected = selectedOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => handleOccasionSelect(occ.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-200 shadow-sm text-rose-900'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-xl">{occ.emoji}</span>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{occ.label}</span>
                      <span className="text-[10px] text-stone-400 font-normal line-clamp-1">{occ.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Recipient */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Step 2: Who are you gifting?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {recipientOptions.map((rec) => {
                  const isSelected = selectedRecipient === rec.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => setSelectedRecipient(rec.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                        isSelected
                          ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-200 shadow-sm text-rose-900'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="text-lg">{rec.icon}</span>
                      <span className="text-xs font-bold">{rec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Budget Range */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Step 3: Select Budget Range in ₹ INR
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {budgetOptions.map((b) => {
                  const isSelected = selectedBudget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBudget(b.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-200 shadow-sm text-rose-900 font-bold'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold text-xs'
                      }`}
                    >
                      <span className="text-xs">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filtered Gift Results Showcase */}
      <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Gift className="w-4 h-4" />
              <span>Gifts Available for Instant Dispatch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {selectedOccasion === 'all'
                ? 'Curated Gifting Recommendations'
                : `${selectedOccasion} Gift Collection`}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {products.length} handpicked gifts with free greeting card &amp; luxury packing options
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              No matching gifts found for this combination
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Try choosing "All Gifts" or widening your budget filter to see our full artisan collection.
            </p>
            <button
              onClick={resetFinder}
              className="px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Dedicated Milestone Highlights: 🎂 Birthday & 💍 Anniversary */}
      {selectedOccasion === 'all' && (
        <>
          {/* Birthday Row */}
          {birthdayGifts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent p-6 rounded-3xl border border-amber-200/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md">
                    🎂
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      Birthday Celebration Specials
                    </h3>
                    <p className="text-xs text-stone-500">
                      Joyous gifts, gourmet sweets, personalized watches &amp; party surprises
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOccasionSelect('Birthday')}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  View All Birthday Gifts →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {birthdayGifts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Anniversary Row */}
          {anniversaryGifts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent p-6 rounded-3xl border border-rose-200/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-md">
                    💍
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">
                      Anniversary &amp; Romantic Keepsakes
                    </h3>
                    <p className="text-xs text-stone-500">
                      Cherish love and togetherness with luxury timepieces, pure silks &amp; engraved frames
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOccasionSelect('Anniversary')}
                  className="px-4 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  View All Anniversary Gifts →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {anniversaryGifts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. Gifting Signature Services & Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base">Custom Engraving</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Add recipient names, anniversaries, and personal inscriptions directly onto your chosen gift plaque.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base">Free Calligraphy Card</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every parcel comes with a complimentary handwritten card inscribed with your custom heartfelt celebration note.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base">Scheduled Delivery</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Select your exact birthday or anniversary date at checkout for synchronized express courier coordination.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base">NestAssured Guarantee</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              100% genuine craftsmanship verified by our quality specialists with 7-day hassle-free replacement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftStudioPage;
