const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Permissive CORS configuration for Vercel, Render and Localhost
app.use(
  cors({
    origin: true, // Allow all origins with credentials for production flexibility
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API (Accessible at /, /health, and /api/health)
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    application: 'GiftNest API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// API Routes (Mounted under both /api and root / so any client URL format works)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/banners', '/banners'], bannerRoutes);
app.use(['/api/gallery', '/gallery'], galleryRoutes);
app.use(['/api/seller', '/seller'], sellerRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 GiftNest Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
