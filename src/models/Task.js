const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Thuộc sự kiện nào
    title: { type: String, required: true }, // Tên nhiệm vụ (VD: "Kê bàn")
    group: { type: String, default: 'Chung' }, // Nhóm (VD: "Nhóm khu A", "Nhóm khu C")
    description: { type: String }, // Mô tả công việc (VD: "Kê bàn theo đúng khu vực quy định")
    
    startTime: { type: Date, required: true }, // Giờ bắt đầu
    endTime: { type: Date, required: true },   // Giờ kết thúc
    
    // Những ai được giao làm task này?
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Tọa độ ghim trên Custom Map (Tính bằng %)
    // VD: x: 50, y: 50 nghĩa là ghim nằm ngay chính giữa ảnh bản đồ
    mapCoordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    
    // Trạng thái của task
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'], // Cần làm, Đang làm, Hoàn thành
      default: 'TODO'
    },
    
    // Ảnh chứng nhận hoàn thành (Nhân viên upload lên khi làm xong)
    proofImage: { type: String, default: '' } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);