const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide banner title'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Please provide banner image URL'],
    },
    buttonText: {
      type: String,
      default: 'Shop Now',
    },
    buttonLink: {
      type: String,
      default: '/shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
