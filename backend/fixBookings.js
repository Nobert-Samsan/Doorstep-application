const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Category = require('./models/Category');

dotenv.config();

const fixBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doorstep');
    
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found!');
      process.exit(1);
    }

    const bookings = await Booking.find();
    
    for (const booking of bookings) {
      // Pick a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      booking.categoryId = randomCategory._id;
      await booking.save();
    }
    
    console.log(`Updated ${bookings.length} bookings with real categories!`);
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
};

fixBookings();
