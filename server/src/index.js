const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');
const verifyRoutes = require('./routes/verify');
const orgRoutes = require('./routes/org');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Base URL Handler for Vercel
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'QuickCheck AI Backend API Engine is Operational',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      certificates: '/api/certificates',
      verify: '/api/verify',
      org: '/api/org',
      admin: '/api/admin',
      user: '/api/user'
    },
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'QuickCheck AI Fraud Certificate Verification Platform',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Global Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Only listen on port if not running in Vercel Serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` QuickCheck AI Backend Server running on port ${PORT}`);
    console.log(` API Endpoint: http://127.0.0.1:${PORT}/api`);
    console.log(` Uploads static path: http://127.0.0.1:${PORT}/uploads`);
    console.log(`====================================================`);
  });
}

module.exports = app;
