import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  AlertCircle,
  Check,
  X,
  Eye,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const AdminProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Product Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: 10,
    description: '',
    images: '',
    occasion: 'General',
    isFeatured: false,
  });

  const occasionsList = [
    'Birthday',
    'Anniversary',
    'Wedding',
    'Corporate',
    'Festival',
    'Personalised Gifts',
    'General',
  ];

  // Load products and categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories'),
      ]);
      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
      }
    } catch (err) {
      console.error('Failed to load products in admin:', err);
      showToast('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      price: '',
      stock: 10,
      description: '',
      images: '',
      occasion: 'General',
      isFeatured: false,
    });
    setFormError(null);
    setFormModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      price: product.price,
      stock: product.stock,
      description: product.description,
      images: product.images?.join(', ') || '',
      occasion: product.occasion || 'General',
      isFeatured: Boolean(product.isFeatured),
    });
    setFormError(null);
    setFormModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.category || !formData.price || !formData.description) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        images: formData.images.split(',').map((img) => img.trim()).filter(Boolean),
        occasion: formData.occasion,
        isFeatured: formData.isFeatured,
      };

      if (selectedProduct) {
        // Update
        const res = await api.put(`/products/${selectedProduct._id}`, payload);
        if (res.data.success) {
          showToast(`Product "${res.data.product.name}" updated successfully.`, 'success');
        }
      } else {
        // Create
        const res = await api.post('/products', payload);
        if (res.data.success) {
          showToast(`Product "${res.data.product.name}" created successfully.`, 'success');
        }
      }

      setFormModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save product:', err);
      setFormError(err.response?.data?.message || 'Error saving product. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      const res = await api.delete(`/products/${selectedProduct._id}`);
      if (res.data.success) {
        showToast('Product deleted successfully.', 'success');
        setDeleteModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeatured = async (product) => {
    try {
      const res = await api.put(`/products/${product._id}`, {
        isFeatured: !product.isFeatured,
      });
      if (res.data.success) {
        showToast(
          `Product ${res.data.product.isFeatured ? 'marked as Featured' : 'unmarked from Featured'}.`,
          'success'
        );
        fetchData();
      }
    } catch (err) {
      console.error('Toggle featured failed:', err);
      showToast('Failed to update featured state', 'error');
    }
  };

  // Filtered by search
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q) ||
      p.occasion?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Product Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, update, manage stock counts, and showcase featured gifts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 flex items-center">
        <Search className="w-4 h-4 text-stone-400 ml-2 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, occasion, or category..."
          className="w-full text-xs bg-transparent focus:outline-none text-stone-800"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-stone-400 hover:text-stone-600 mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400 space-y-2">
            <Package className="w-8 h-8 mx-auto text-stone-300" />
            <p>No products found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Occasion</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {filteredProducts.map((product) => {
                  const mainImage = product.images?.[0] || '';
                  const isLow = product.stock <= 5;

                  return (
                    <tr key={product._id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3 max-w-xs">
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                          />
                          <div className="truncate">
                            <p className="font-bold text-stone-900 truncate font-serif">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-stone-400 truncate">
                              ID: #{product._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                          {product.category?.name || 'Unassigned'}
                        </span>
                      </td>

                      {/* Occasion */}
                      <td className="p-4 text-stone-600">{product.occasion}</td>

                      {/* Price */}
                      <td className="p-4 font-bold text-stone-900 font-sans">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        <span
                          className={`font-mono font-bold px-2.5 py-1 rounded-full text-[11px] ${
                            product.stock === 0
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleFeatured(product)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            product.isFeatured
                              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600'
                          }`}
                          title={product.isFeatured ? 'Featured on homepage' : 'Not featured'}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedProduct ? 'Edit Product Details' : 'Create New Gift Product'}
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Artisan Birthday Celebration Hamper"
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Occasion *
              </label>
              <select
                required
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {occasionsList.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="49.99"
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Available Stock Count *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Image URLs (Comma separated) *
            </label>
            <input
              type="text"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              Provide one or multiple high-res image URLs separated by commas.
            </span>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the items in this gift crate, materials, packaging, etc."
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-stone-700 cursor-pointer">
              Show in "Featured Gifts" section on Homepage
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : selectedProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-stone-900 font-bold">"{selectedProduct?.name}"</strong>? This
            action cannot be undone and will remove the product from the store catalog.
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-5 py-2 rounded-full border border-stone-200 text-stone-600 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
