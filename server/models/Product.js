const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be a positive number'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image URL',
      },
    },
    occasion: {
      type: String,
      required: [true, 'Please specify an occasion'],
      enum: [
        'Birthday',
        'Anniversary',
        'Wedding',
        'Corporate',
        'Festival',
        'Personalised Gifts',
        'General',
      ],
      default: 'General',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast searching across name and description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
