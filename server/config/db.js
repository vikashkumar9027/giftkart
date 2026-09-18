const dns = require('dns');
const mongoose = require('mongoose');

// Configure Google DNS fallback to prevent querySrv ECONNREFUSED on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Ignore in environments where setServers is restricted
}

let isConnected = false;

const connectDB = async () => {
  // Reuse existing database connection if already open (crucial for Vercel serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/giftnest', {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Only exit in standalone local development, do not crash serverless workers
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
