import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

const AdminGalleryPage = () => {
  const { showToast } = useToast();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: 'General',
    isActive: true,
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery?all=true');
      if (res.data.success) {
        setGallery(res.data.gallery);
      }
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      showToast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      image: '',
      category: 'General',
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
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
      const res = await api.post('/gallery', formData);
      if (res.data.success) {
        showToast('Gallery image added successfully.', 'success');
        setModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      console.error('Failed to create gallery item:', err);
      setError(err.response?.data?.message || 'Error saving gallery image.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (item) => {
    try {
      const res = await api.patch(`/gallery/${item._id}/status`, {
        isActive: !item.isActive,
      });
      if (res.data.success) {
        showToast(
          `Gallery item is now ${res.data.item.isActive ? 'Active' : 'Inactive'}.`,
          'success'
        );
        fetchGallery();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast('Error updating gallery item status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const res = await api.delete(`/gallery/${selectedItem._id}`);
      if (res.data.success) {
        showToast('Gallery item deleted successfully.', 'success');
        setDeleteModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      showToast(err.response?.data?.message || 'Failed to delete gallery item.', 'error');
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
            Gallery CMS
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage showcase snapshots from packaging, gifting events, and customer memories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleStatus(item)}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs transition-all flex items-center space-x-1 ${
                      item.isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {item.isActive ? (
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

                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    {item.category || 'General'}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1">{item.title}</h3>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-end border-t border-stone-100 mt-2">
                <button
                  onClick={() => openDeleteModal(item)}
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

      {/* Add Gallery Item Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Image to Gallery"
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
              Title / Caption *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Handcrafted Packaging Perfection"
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Image URL *
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

          {/* Live Preview */}
          {formData.image && (
            <div className="space-y-1">
              <span className="font-bold text-stone-500 text-[10px] uppercase">Image Preview:</span>
              <div className="w-full h-40 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold uppercase tracking-wider text-stone-500 mb-1">
              Category / Tag
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Packaging, Birthday, Wedding..."
              className="w-full px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="galleryIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
            />
            <label htmlFor="galleryIsActive" className="text-xs font-semibold text-stone-700 cursor-pointer">
              Visible in customer homepage gallery
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
              {submitting ? 'Saving...' : 'Add Gallery Photo'}
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
            Are you sure you want to delete image{' '}
            <strong className="text-stone-900">"{selectedItem?.title}"</strong>?
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
              {submitting ? 'Deleting...' : 'Yes, Delete Photo'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGalleryPage;
