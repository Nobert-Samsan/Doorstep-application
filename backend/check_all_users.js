const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doorstep')
  .then(async () => {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10);
    console.log('Last 10 users registered:');
    users.forEach(u => {
      console.log(`- ${u.firstName} ${u.lastName} (${u.email}) | Role: ${u.role} | createdAt: ${u.createdAt}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
