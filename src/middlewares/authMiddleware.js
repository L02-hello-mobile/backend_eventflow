const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra header authorization xem có chứa token dạng "Bearer <token>" không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Lấy phần token

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB bằng ID đã giải mã, gán vào req.user (bỏ đi password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
      res.status(401).json({ success: false, message: 'Không có quyền truy cập, token hỏng hoặc hết hạn' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Không có quyền truy cập, thiếu token' });
  }
};

module.exports = { protect };