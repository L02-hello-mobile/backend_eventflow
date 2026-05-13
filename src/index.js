const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route kiểm tra server (Health Check)
app.get('/', (req, res) => {
  res.send('EventFlow API is running...');
});

// Gắn các API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Cấu hình Port và Listen (Chỉ chạy listen khi không phải môi trường Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
}

// Quan trọng: Export app để Vercel nhận diện làm Serverless Function
module.exports = app;