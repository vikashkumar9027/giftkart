import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, X, Frown, Sparkles, Gift, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';
import Pagination from '../../components/common/Pagination';
import { ProductCardSkeleton } from '../../components/common/LoadingSkeleton';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params
  const categoryParam = searchParams.get('category') || 'all';
  const occasionParam = searchParams.get('occasion') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;
  const isGiftParam = searchParams.get('isGift') === 'true';

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync search input if URL changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load categories list for filter pills
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on params
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryParam && categoryParam !== 'all') params.append('category', categoryParam);
      if (occasionParam && occasionParam !== 'all') params.append('occasion', occasionParam);
      if (isGiftParam) params.append('isGift', 'true');
      if (searchParam && searchParam.trim()) params.append('search', searchParam.trim());
      if (sortParam) params.append('sort', sortParam);
      params.append('page', pageParam);
      params.append('limit', 9);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalProducts(res.data.totalProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [categoryParam, occasionParam, isGiftParam, searchParam, sortParam, pageParam]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Handlers for changing filters
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const occasionsList = ['Birthday', 'Anniversary', 'Wedding', 'Festival', 'Valentine', 'Personalised', 'Corporate'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catalog &amp; Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Gifts Curated for Every Milestone
        </h1>
        <p className="text-sm text-stone-500">
          Explore artisanal chocolates, preserved botanical arrangements, customized keepsake boxes, and luxurious celebratory hampers.
        </p>
      </div>

      {/* Dedicated Gift Options Callout Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-2xl">
            🎁
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Looking for Birthday or Anniversary gifts specifically?</h3>
            <p className="text-xs text-rose-100 mt-0.5">Use our dedicated 3-step Smart Gift Finder to choose by recipient &amp; budget in ₹ INR</p>
          </div>
        </div>
        <Link
          to="/gifts"
          className="shrink-0 px-5 py-2.5 rounded-full bg-white text-rose-600 font-bold text-xs hover:bg-stone-100 transition-colors shadow-sm flex items-center space-x-1.5"
        >
          <span>Open Gift Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Controls Bar: Search, Quick Gifts Toggle & Sort */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search gifts or products..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParam('search', '');
              }}
              className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Middle Quick Toggles: All vs Gifts Only */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-start">
          <button
            type="button"
            onClick={() => updateParam('isGift', 'all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              !isGiftParam
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Products
          </button>
          <button
            type="button"
            onClick={() => updateParam('isGift', isGiftParam ? 'all' : 'true')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              isGiftParam
                ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <span>🎁</span>
            <span>Gifts Only</span>
          </button>
        </div>

        {/* Right side controls: Filter toggle (mobile) & Sort dropdown */}
        <div className="flex items-center justify-between w-full md:w-auto space-x-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700"
          >
            <Filter className="w-4 h-4 text-stone-500" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-stone-400 hidden sm:inline-block" />
            <span className="text-xs font-semibold text-stone-500 hidden sm:inline-block">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort products"
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer text-stone-700"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filters & Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">Filters</h3>
              {(categoryParam !== 'all' || occasionParam !== 'all' || isGiftParam || searchParam) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Gifting Mode Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Item Type
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('isGift', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    !isGiftParam
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => updateParam('isGift', 'true')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isGiftParam
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span>🎁</span>
                    <span>Gifts Only</span>
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    Special
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Categories
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    categoryParam === 'all'
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => {
                  const isSelected =
                    categoryParam === cat.slug || categoryParam === cat._id;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                          {cat.productCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Occasion
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('occasion', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    occasionParam === 'all'
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  All Occasions
                </button>
                {occasionsList.map((occ) => {
                  const isSelected = occasionParam.toLowerCase() === occ.toLowerCase();
                  return (
                    <button
                      key={occ}
                      onClick={() => updateParam('occasion', occ)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative z-10 w-4/5 max-w-sm bg-white p-6 h-full overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-lg text-stone-900">Filter Gifts</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gifting Mode */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Item Type
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateParam('isGift', 'all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      !isGiftParam ? 'bg-rose-50 text-rose-700 font-bold' : 'text-stone-600'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => {
                      updateParam('isGift', 'true');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                      isGiftParam ? 'bg-rose-50 text-rose-700 font-bold' : 'text-stone-600'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <span>🎁</span>
                      <span>Gifts Only</span>
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                      Special
                    </span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      updateParam('category', 'all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                      categoryParam === 'all' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-stone-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        updateParam('category', cat.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        categoryParam === cat.slug ? 'bg-rose-50 text-rose-700 font-bold' : 'text-stone-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Occasion
                </h4>
                <div className="space-y-1">
                  {occasionsList.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => {
                        updateParam('occasion', occ);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        occasionParam === occ ? 'bg-rose-50 text-rose-700 font-bold' : 'text-stone-600'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active Filters Bar */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-stone-500 font-medium">
              Showing <span className="font-bold text-stone-800">{products.length}</span> of{' '}
              <span className="font-bold text-stone-800">{totalProducts}</span> gifts
            </span>

            {(categoryParam !== 'all' || occasionParam !== 'all' || searchParam) && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center my-8">
              <p className="font-medium text-sm">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-3 px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-800">
                No matching gifts found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                We couldn’t find any items matching your selected criteria. Try adjusting your search keyword or resetting the filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-all shadow-sm shadow-rose-200"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={(p) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', p.toString());
                  setSearchParams(newParams);
                }}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
