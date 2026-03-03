const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_doctor', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('SSL') || error.message.includes('alert 80')) {
      console.error('📢 TIP: This likely means your IP is not whitelisted on MongoDB Atlas.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
