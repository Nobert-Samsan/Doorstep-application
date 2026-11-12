const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createServer } = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Enable trust proxy for Render / Cloudflare reverse proxies
app.set('trust proxy', 1);

// Init Socket.io
initSocket(httpServer);

// Middleware
app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customer', require('./routes/customer.routes'));
app.use('/api/worker', require('./routes/worker.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/quotations', require('./routes/quotation.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/job-posts', require('./routes/jobPost.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Basic route
app.get('/', (req, res) => {
  res.send('DoorStep API is running...');
});

// Diagnostic debug route
app.get('/api/debug-status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Test a basic query
    let userCount = -1;
    let dbError = null;
    try {
      const User = require('./models/User');
      userCount = await User.countDocuments();
    } catch (err) {
      dbError = err.message;
    }

    res.json({
      success: true,
      env: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 25) + '...' : null,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSmtpUser: !!process.env.SMTP_USER,
      dbState: dbStates[dbState] || dbState,
      userCount,
      dbError
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


module.exports = app;
