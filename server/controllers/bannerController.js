const Banner = require('../models/Banner');

// @desc    Get banners (active only for public, all for admin if requested)
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    const { all } = req.query;
    let query = { isActive: true };

    if (all === 'true') {
      query = {};
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
const getBannerById = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, isActive } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title and image URL are required.',
      });
    }

    const banner = await Banner.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      image: image.trim(),
      buttonText: buttonText ? buttonText.trim() : 'Shop Now',
      buttonLink: buttonLink ? buttonLink.trim() : '/shop',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully.',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image, buttonText, buttonLink, isActive } = req.body;

    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    if (title) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (image) banner.image = image.trim();
    if (buttonText) banner.buttonText = buttonText.trim();
    if (buttonLink) banner.buttonLink = buttonLink.trim();
    if (isActive !== undefined) banner.isActive = Boolean(isActive);

    await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully.',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.',
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
