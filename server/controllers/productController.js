const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with search, filters, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      occasion,
      featured,
      sort,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // 1. Search by name or description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ];
    }

    // 2. Filter by Category (can be ObjectId or category slug/name)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({
          $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }],
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // 3. Filter by Occasion
    if (occasion && occasion !== 'all') {
      query.occasion = new RegExp(`^${occasion}$`, 'i');
    }

    // 4. Filter by Featured
    if (featured === 'true' || featured === true) {
      query.isFeatured = true;
    }

    // 5. Filter by inStock
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 6. Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 9);
    const skip = (pageNumber - 1) * pageSize;

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize) || 1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNumber,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      description,
      stock,
      images,
      occasion,
      isFeatured,
    } = req.body;

    // Validation
    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price, and description are required fields.',
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number.',
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative.',
      });
    }

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.',
      });
    }

    // Format images array
    let imagesArr = [];
    if (Array.isArray(images)) {
      imagesArr = images.filter((img) => img && img.trim().length > 0);
    } else if (typeof images === 'string' && images.trim()) {
      imagesArr = images.split(',').map((img) => img.trim());
    }

    if (imagesArr.length === 0) {
      imagesArr = [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      ];
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      stock: stock !== undefined ? Number(stock) : 10,
      images: imagesArr,
      occasion: occasion || 'General',
      isFeatured: Boolean(isFeatured),
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      description,
      stock,
      images,
      occasion,
      isFeatured,
    } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.',
        });
      }
      product.category = category;
    }

    if (name) product.name = name.trim();
    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number.',
        });
      }
      product.price = Number(price);
    }
    if (description) product.description = description.trim();
    if (stock !== undefined) {
      if (Number(stock) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative.',
        });
      }
      product.stock = Number(stock);
    }

    if (images) {
      let imagesArr = [];
      if (Array.isArray(images)) {
        imagesArr = images.filter((img) => img && img.trim().length > 0);
      } else if (typeof images === 'string') {
        imagesArr = images.split(',').map((img) => img.trim()).filter(Boolean);
      }
      if (imagesArr.length > 0) {
        product.images = imagesArr;
      }
    }

    if (occasion) product.occasion = occasion;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
