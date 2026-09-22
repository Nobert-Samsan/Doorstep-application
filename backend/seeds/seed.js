const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const WorkerProfile = require('../models/WorkerProfile');

dotenv.config({ path: '../.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doorstep');

    console.log('MongoDB Connected for Seeding...');

    // Clear existing
    await User.deleteMany();
    await Category.deleteMany();
    await WorkerProfile.deleteMany();

    // Create Admin
    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+94770000000',
      email: 'admin@doorstep.lk',
      password: 'password123', // Will be hashed by pre-save middleware
      role: 'admin',
      isPhoneVerified: true,
      isEmailVerified: true
    });

    // Create Test Customer
    await User.create({
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+94779999999',
      email: 'test@doorstep.lk',
      password: 'password123',
      role: 'customer',
      city: 'Colombo',
      isPhoneVerified: true,
      isEmailVerified: true
    });

    // Create 12 Categories with real image URLs
    const categories = [
      { nameEn: 'Plumbing', nameSi: 'ජලනල', nameTa: 'குழாய்', description: 'Expert plumbing services', icon: 'https://images.unsplash.com/photo-1607472586893-edb57cb5b282?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Electrical', nameSi: 'විදුලි', nameTa: 'மின்சார', description: 'Electrical repairs and wiring', icon: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Carpentry', nameSi: 'වඩු වැඩ', nameTa: 'தச்சு', description: 'Woodwork and furniture repair', icon: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Painting', nameSi: 'පින්තාරු කිරීම', nameTa: 'ஓவியம்', description: 'House and building painting', icon: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Masonry', nameSi: 'මේසන්', nameTa: 'கொத்து', description: 'Brickwork and concrete', icon: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Cleaning', nameSi: 'පිරිසිදු කිරීම', nameTa: 'சுத்தம்', description: 'Deep cleaning services', icon: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'AC Repair', nameSi: 'වායුසමීකරණ', nameTa: 'ஏசி', description: 'AC installation and repair', icon: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Gardening', nameSi: 'ගෙවතු වගාව', nameTa: 'தோட்டம்', description: 'Landscaping and gardening', icon: 'https://images.unsplash.com/photo-1558904541-efa843a96f09?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Pest Control', nameSi: 'පළිබෝධ', nameTa: 'பூச்சி', description: 'Extermination services', icon: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Roofing', nameSi: 'වහල', nameTa: 'கூரை', description: 'Roof repair and installation', icon: 'https://images.unsplash.com/photo-1632759145355-66d499298492?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'Appliance Repair', nameSi: 'උපකරණ', nameTa: 'உபகரணங்கள்', description: 'Home appliances repair', icon: 'https://images.unsplash.com/photo-1581092918056-0c460a5fc619?w=500&auto=format&fit=crop&q=60' },
      { nameEn: 'CCTV Installation', nameSi: 'ආරක්ෂක', nameTa: 'பாதுகாப்பு', description: 'Camera and security systems', icon: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60' }
    ];

    const insertedCategories = await Category.insertMany(categories);

    const workersData = [
      { firstName: 'Nimal', lastName: 'Perera', phone: '+94771111111', cat: 'Plumbing', rate: 1500, rating: 4.9, reviews: 124, district: 'Colombo', districts: ['Colombo'] },
      { firstName: 'Ruwan', lastName: 'Fernando', phone: '+94772222222', cat: 'Electrical', rate: 2000, rating: 4.8, reviews: 98, district: 'Kalutara', districts: ['Kalutara', 'Colombo'] },
      { firstName: 'Sunil', lastName: 'Silva', phone: '+94773333333', cat: 'AC Repair', rate: 3500, rating: 5.0, reviews: 45, district: 'Gampaha', districts: ['Gampaha'] },
      { firstName: 'Kasun', lastName: 'Bandara', phone: '+94774444444', cat: 'Carpentry', rate: 2500, rating: 4.7, reviews: 67, district: 'Kandy', districts: ['Kandy'] },
      { firstName: 'Nuwan', lastName: 'Jayasooriya', phone: '+94775555555', cat: 'Painting', rate: 1800, rating: 4.9, reviews: 112, district: 'Galle', districts: ['Galle'] },
      { firstName: 'Chathura', lastName: 'Gunawardena', phone: '+94776666666', cat: 'Cleaning', rate: 1200, rating: 4.8, reviews: 88, district: 'Colombo', districts: ['Colombo', 'Kalutara'] },
      { firstName: 'Saman', lastName: 'Kumara', phone: '+94777777777', cat: 'Masonry', rate: 2200, rating: 4.6, reviews: 54, district: 'Kurunegala', districts: ['Kurunegala'] },
      { firstName: 'Dinesh', lastName: 'Chandimal', phone: '+94778888888', cat: 'Roofing', rate: 3000, rating: 5.0, reviews: 32, district: 'Matara', districts: ['Matara', 'Galle'] }
    ];

    for (const w of workersData) {
      // 1. Create User
      const user = await User.create({
        firstName: w.firstName,
        lastName: w.lastName,
        phone: w.phone,
        email: `${w.firstName.toLowerCase()}@doorstep.lk`,
        password: 'password123',
        role: 'worker',
        isPhoneVerified: true
      });

      // Find the specific category ID
      const categoryId = insertedCategories.find(c => c.nameEn === w.cat)._id;

      // 2. Create WorkerProfile
      await WorkerProfile.create({
        userId: user._id,
        bio: `Hi, I am ${w.firstName}. I have over 10 years of experience in ${w.cat}. I guarantee high quality and timely service.`,
        nicNumber: `198${Math.floor(Math.random() * 10000000)}V`,
        address: `123 ${w.district} Road`,
        city: w.district,
        serviceDistricts: w.districts,
        approvalStatus: 'approved',
        isAvailable: true,
        averageRating: w.rating,
        totalReviews: w.reviews,
        verifiedBadge: true,
        totalYearsExperience: 10,
        services: [{
          categoryId: categoryId,
          serviceTitle: w.cat,
          serviceDescription: `Professional ${w.cat} services with 10 years experience.`,
          yearsExperience: 10,
          pricingType: 'fixed',
          fixedRate: w.rate,
          chargeType: 'job',
          specificSkills: ['Repairs', 'Installations', 'Maintenance']
        }]
      });
    }

    console.log('Database Seeded Successfully with Featured Workers!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
