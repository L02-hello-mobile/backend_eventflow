const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình tài khoản
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Thiết lập nơi lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EventFlow_Images', // Thư mục sẽ tự động tạo trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Chỉ cho phép các định dạng này
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Tự động resize nếu ảnh quá lớn
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;