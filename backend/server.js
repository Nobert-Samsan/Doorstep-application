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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
