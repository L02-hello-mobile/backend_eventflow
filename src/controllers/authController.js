const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hàm tạo Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token sống trong 30 ngày
  });
};

// [POST] - Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
    }

    // Tạo user mới (Mật khẩu sẽ tự được mã hóa nhờ pre-save hook ở Model)
    const user = await User.create({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id) // Trả về token cho Mobile lưu lại
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] - Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });

    // Kiểm tra user có tồn tại và mật khẩu có khớp không
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          token: generateToken(user._id) // Trả về token
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };