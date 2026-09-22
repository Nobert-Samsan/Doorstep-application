const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Booking = require('./models/Booking');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doorstep')
  .then(async () => {
  try {
    const customer = await User.findOne({ role: 'customer' });
    const worker = await User.findOne({ email: 'nobertsam1812@gmail.com' });
    const category = await Category.findOne();

    if (!customer || !worker || !category) {
      console.log("Missing required entities in DB.");
      process.exit(1);
    }

    console.log("Found customer:", customer.email);
    console.log("Found worker:", worker.email);
    console.log("Found category:", category.nameEn);

    const activeJob = new Booking({
      customerId: customer._id,
      workerId: worker._id,
      categoryId: category._id,
      serviceTitle: 'Fix Leaking Kitchen Sink',
      jobDescription: 'Pipe under the sink is leaking badly. Need it fixed today.',
      streetAddress: '45 Galle Road',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western',
      scheduledDate: new Date(),
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      urgency: 'urgent',
      budgetType: 'open',
      pricingType: 'variable',
      status: 'accepted'
    });

    const completedJob = new Booking({
      customerId: customer._id,
      workerId: worker._id,
      categoryId: category._id,
      serviceTitle: 'AC Servicing and Gas Refill',
      jobDescription: 'Full servicing for 2 AC units.',
      streetAddress: '45 Galle Road',
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western',
      scheduledDate: new Date(Date.now() - 86400000 * 5),
      scheduledTimeSlot: '02:00 PM - 04:00 PM',
      urgency: 'normal',
      budgetType: 'fixed',
      pricingType: 'fixed',
      status: 'completed'
    });

    await activeJob.save();
    await completedJob.save();

    console.log("Successfully seeded 1 active and 1 completed job!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
