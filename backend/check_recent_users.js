const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doorstep')
  .then(async () => {
    const users = await User.find({ role: 'worker' }).sort({ createdAt: -1 }).limit(10);
    console.log('Recent workers registered in User collection:', users.length);
    users.forEach(u => {
      console.log(`- ${u.firstName} ${u.lastName} (${u.email}) | id: ${u._id}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
