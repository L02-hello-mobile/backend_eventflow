const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ép Node.js sử dụng IPv4 thay vì IPv6 để tránh lỗi mạng Viettel
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, 
      serverSelectionTimeoutMS: 5000 // Chờ tối đa 5 giây
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối DB: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;