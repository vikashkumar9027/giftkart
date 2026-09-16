const express = require('express');
const router = express.Router();
const {
  getGallery,
  createGalleryItem,
  updateGalleryStatus,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getGallery);
router.post('/', protect, adminOnly, createGalleryItem);
router.patch('/:id/status', protect, adminOnly, updateGalleryStatus);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
