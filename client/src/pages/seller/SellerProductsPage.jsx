import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';

const SellerProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    occasion: 'Festive',
    price: '',
    mrp: '',
    stock: 20,
    imageUrl: '',
    description: '',
    highlights: '',
    brand: '',
    material: '',
    warranty: '1 Year Domestic Warranty',
    isFeatured: false,
    isAssured: true,
  });

  const [saving, setSaving] = useState(false);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/seller/products'),
        api.get('/categories'),
      ]);

      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
        if (!formData.category && catRes.data.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
      showToast('Failed to load seller catalog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      occasion: 'Festive',
      price: '',
      mrp: '',
      stock: 20,
      imageUrl: '',
      description: '',
      highlights: '',
      brand: '',
      material: '',
      warranty: '1 Year Domestic Warranty',
      isFeatured: false,
      isAssured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setIsEditing(true);
    setCurrentId(prod._id);
    setFormData({
      name: prod.name,
      category: prod.category?._id || prod.category || '',
      occasion: prod.occasion || 'Festive',
      price: prod.price,
      mrp: prod.mrp || prod.price,
      stock: prod.stock,
      imageUrl: prod.images?.[0] || '',
      description: prod.description || '',
      highlights: (prod.highlights || []).join('\n'),
      brand: prod.specifications?.brand || '',
      material: prod.specifications?.material || '',
      warranty: prod.specifications?.warranty || '1 Year Domestic Warranty',
      isFeatured: prod.isFeatured || false,
      isAssured: prod.isAssured !== false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your store catalog?`)) {
      return;
    }

    try {
      const res = await api.delete(`/seller/products/${id}`);
      if (res.data.success) {
        showToast('Product successfully removed', 'success');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Delete product error:', err);
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const highlightsArray = formData.highlights
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const specifications = {
        brand: formData.brand || 'Artisan Direct',
        material: formData.material || 'Premium Quality',
        warranty: formData.warranty || 'Standard Warranty',
      };

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        occasion: formData.occasion,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price),
        stock: Number(formData.stock),
        images: formData.imageUrl.trim()
          ? [formData.imageUrl.trim()]
          : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'],
        description: formData.description.trim(),
        highlights: highlightsArray,
        specifications,
        isFeatured: formData.isFeatured,
        isAssured: formData.isAssured,
      };

      if (isEditing) {
        const res = await api.put(`/seller/products/${currentId}`, payload);
        if (res.data.success) {
          showToast('Listing updated successfully!', 'success');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      } else {
        const res = await api.post('/seller/products', payload);
        if (res.data.success) {
          showToast('New product added to your catalog!', 'success');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      }
    } catch (err) {
      console.error('Save product error:', err);
      showToast(err.response?.data?.message || 'Failed to save product listing', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your store's listings, update stock levels, prices in ₹ INR, and Flipkart-style NestAssured status.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings by title or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">No listings found</h3>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              You haven't listed any items matching this filter. Click below to add your first product!
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider font-bold bg-stone-50/50">
                  <th className="py-3.5 px-5">Product Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price &amp; MRP</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const discount = calculateDiscount(p.mrp, p.price);
                  return (
                    <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 block truncate max-w-[220px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Occasion: {p.occasion || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-stone-700">
                        {p.category?.name || 'General'}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="font-bold text-stone-900 text-sm">
                            {formatCurrency(p.price)}
                          </span>
                          {p.mrp && p.mrp > p.price && (
                            <span className="text-stone-400 line-through text-[11px]">
                              {formatCurrency(p.mrp)}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            {discount}% off
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 5
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {p.stock <= 0 ? 'Out of Stock' : `${p.stock} units`}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isAssured !== false && (
                            <span className="inline-flex items-center text-[9px] font-black italic text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-blue-600" />
                              NestAssured
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="inline-flex items-center text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                              <Sparkles className="w-2.5 h-2.5 mr-0.5 text-rose-600" />
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-stone-400 hover:text-blue-600 rounded-lg hover:bg-stone-100 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {isEditing ? 'Edit Product Listing' : 'List New Product on GiftNest'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kashmiri Hand-Embroidered Pashmina Shawl"
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Category & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Target Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Festive">Festive / Diwali / Puja</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary & Romance</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate & Executive</option>
                    <option value="General">General / All Occasions</option>
                  </select>
                </div>
              </div>

              {/* Pricing in INR & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Maximum Retail Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="2499 (for % off badge)"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Product Image URL (Unsplash or direct CDN)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed craftsmanship and gifting description..."
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Product Highlights (One bullet per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="100% Pure Organic Material&#10;Handmade by Master Artisans&#10;Complimentary Premium Box Included"
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Royal Heritage"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. Pure Silk / Walnut Wood"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Warranty</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="e.g. 1 Year Replacement"
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAssured}
                    onChange={(e) => setFormData({ ...formData, isAssured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-stone-700">Apply NestAssured Badge</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-semibold text-stone-700">Feature on Storefront</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{isEditing ? 'Save Changes' : 'Publish Listing'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
