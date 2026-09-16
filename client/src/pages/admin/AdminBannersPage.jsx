import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Edit2, Trash2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const AdminBannersPage = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    isActive: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners?all=true');
      if (res.data.success) {
        setBanners(res.data.banners);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      showToast('Failed to load banners list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setSelectedBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      buttonText: banner.buttonText || 'Shop Now',
      buttonLink: banner.buttonLink || '/shop',
      isActive: banner.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const openDeleteModal = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.image.trim()) {
      setError('Title and image URL are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedBanner) {
        const res = await api.put(`/banners/${selectedBanner._id}`, formData);
        if (res.data.success) {
          showToast('Banner updated successfully.', 'success');
        }
      } else {
        const res = await api.post('/banners', formData);
        if (res.data.success) {
          showToast('Banner created successfully.', 'success');
        }
      }
      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('Failed to save banner:', err);
      setError(err.response?.data?.message || 'Error saving banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (banner) => {
    try {
      const res = await api.put(`/banners/${banner._id}`, {
        isActive: !banner.isActive,
      });
      if (res.data.success) {
        showToast(
          `Banner ${res.data.banner.isActive ? 'activated' : 'deactivated'}.`,
          'success'
        );
        fetchBanners();
      }
    } catch (err) {
      console.error('Status toggle failed:', err);
      showToast('Failed to change banner active status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner) return;
    setSubmitting(true);
    try {
      const res = await api.delete(`/banners/${selectedBanner._id}`);
      if (res.data.success) {
        showToast('Banner deleted successfully.', 'success');
        setDeleteModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      console.error('Error deleting banner:', err);
      showToast(err.response?.data?.message || 'Failed to delete banner.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top action bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Banners & Promotions CMS
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage promotional hero slides, headlines, and call-to-action destination links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleStatus(banner)}
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm transition-all flex items-center space-x-1 ${
                      banner.isActive
                        ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {banner.subtitle || 'No subtitle provided.'}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400 pt-1">
                    <span className="bg-stone-100 px-2 py-0.5 rounded">
                      Button: "{banner.buttonText}"
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded truncate">
                      → {banner.buttonLink}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex justify-end space-x-2 border-t border-stone-100 mt-2">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-semibold flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => openDeleteModal(banner)}
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedBanner ? 'Edit Banner' : 'Create New Promotional Banner'}
        maxWidth="max-w-lg"
      >
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Main Headline Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Unwrap Moments That Last Forever"
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Banner Image URL *
            </label>
            <input
              type="text"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Subtitle Description
            </label>
            <textarea
              rows={2}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Short supporting description..."
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Shop Now"
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
                Button Target Link
              </label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/shop"
                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="bannerIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
            />
            <label htmlFor="bannerIsActive" className="text-xs font-semibold text-stone-700 cursor-pointer">
              Set banner active on homepage
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : selectedBanner ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Banner Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Are you sure you want to delete banner{' '}
            <strong className="text-stone-900">"{selectedBanner?.title}"</strong>? This will remove
            it from the homepage carousel.
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
              {submitting ? 'Deleting...' : 'Yes, Delete Banner'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBannersPage;
