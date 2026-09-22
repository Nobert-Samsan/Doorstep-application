const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/doorstep').then(async () => {
  const WorkerProfile = require('./models/WorkerProfile');
  await WorkerProfile.updateMany({}, { $addToSet: { serviceDistricts: 'Colombo' } });
  console.log('Added Colombo to workers');
  mongoose.disconnect();
});
