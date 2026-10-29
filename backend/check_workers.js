const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const WorkerProfile = require('./models/WorkerProfile');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doorstep')
  .then(async () => {
    const workers = await WorkerProfile.find({}).populate('userId');
    console.log('Total worker profiles in DB:', workers.length);
    workers.forEach((w, idx) => {
      console.log(`\nWorker #${idx+1}:`);
      console.log(`  Name: ${w.userId?.firstName} ${w.userId?.lastName}`);
      console.log(`  Email: ${w.userId?.email}`);
      console.log(`  Approval Status: ${w.approvalStatus}`);
      console.log(`  Service Districts:`, w.serviceDistricts);
      console.log(`  Services:`, JSON.stringify(w.services, null, 2));
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
