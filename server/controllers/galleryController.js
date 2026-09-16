const Gallery = require('../models/Gallery');

// @desc    Get gallery items (active only for public, all for admin if query ?all=true)
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res, next) => {
  try {
    const { all } = req.query;
    let query = { isActive: true };

    if (all === 'true') {
      query = {};
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      gallery: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res, next) => {
  try {
    const { title, image, category, isActive } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title and image URL are required.',
      });
    }

    const item = await Gallery.create({
      title: title.trim(),
      image: image.trim(),
      category: category ? category.trim() : 'General',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully.',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update gallery item active status
// @route   PATCH /api/gallery/:id/status
// @access  Private/Admin
const updateGalleryStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
      });
    }

    item.isActive = isActive !== undefined ? Boolean(isActive) : !item.isActive;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Gallery item is now ${item.isActive ? 'Active' : 'Inactive'}.`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found.',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  updateGalleryStatus,
  deleteGalleryItem,
};
