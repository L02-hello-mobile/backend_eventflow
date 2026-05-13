const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Nhắc ai?
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, // Bấm vào thông báo sẽ phóng to (Zoom) vào Task này
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    
    title: { type: String, required: true }, // VD: "Sắp đến giờ Kê bàn!"
    message: { type: String }, // VD: "Hãy di chuyển đến Khu C trong 5 phút nữa"
    
    isRead: { type: Boolean, default: false } // Đã đọc hay chưa?
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);