const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const User = require('./models/User');

dotenv.config();

const seedBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doorstep');
    console.log('MongoDB Connected');

    const customer = await User.findOne({ role: 'customer' });
    const worker = await User.findOne({ role: 'worker' });

    if (!customer || !worker) {
      console.log('Need at least 1 customer and 1 worker in DB');
      process.exit(1);
    }

    const baseBooking = {
      customerId: customer._id,
      workerId: worker._id,
      categoryId: new mongoose.Types.ObjectId(), // Fake category for now
      jobDescription: 'Seed job description',
      scheduledDate: new Date('2026-10-15'),
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      province: 'Western',
      district: 'Colombo',
      city: 'Colombo 03',
      streetAddress: '123 Main Street',
      pricingType: 'fixed',
      finalAmount: 3500
    };

    const seeds = [
      { ...baseBooking, serviceTitle: 'Initial Inspection', status: 'pending' },
      { ...baseBooking, serviceTitle: 'Fix Leaking Pipe', status: 'in_progress' },
      { ...baseBooking, serviceTitle: 'AC Servicing', status: 'completed' },
      { ...baseBooking, serviceTitle: 'Garden Landscaping', status: 'cancelled' },
      { ...baseBooking, serviceTitle: 'Roof Repair', status: 'complaint' }
    ];

    for (const seed of seeds) {
      await Booking.create(seed);
      console.log(`Created booking: ${seed.serviceTitle} (${seed.status})`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedBookings();
