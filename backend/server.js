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

// Init Socket.io
initSocket(httpServer);

// Middleware
app.use(helmet());
// Ensure DB connection in serverless environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('Database connection middleware error:', e);
  }
  next();
});

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

// Error handling middleware (to be implemented later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


module.exports = app;
