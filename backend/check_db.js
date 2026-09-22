const mongoose = require('mongoose');
const Booking = require('./models/Booking');

mongoose.connect('mongodb://127.0.0.1:27017/doorstep')
  .then(async () => {
    const booking = await Booking.findOne({ _id: '6ab0b8f6ddce525c5b6477eb' });
    console.log("Current Booking Status:", booking.status);
    console.log("Status history:", booking.statusHistory);
    process.exit(0);
  });
