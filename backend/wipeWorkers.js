const mongoose = require('mongoose');
require('dotenv').config();

const wipeWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const result = await db.collection('users').deleteMany({ role: 'worker' });
    console.log(`Deleted ${result.deletedCount} workers`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

wipeWorkers();
