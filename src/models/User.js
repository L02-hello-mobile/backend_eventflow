const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    phoneNumber: { type: String }
  },
  { timestamps: true }
);

// Middleware Mongoose: Tự động mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  // Chỉ mã hóa nếu mật khẩu bị thay đổi hoặc mới tạo
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Hàm hỗ trợ: Kiểm tra mật khẩu lúc đăng nhập có khớp không
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);