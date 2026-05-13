const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mapImageUrl: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Danh sách thành viên tham gia sự kiện
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['ORGANIZER', 'CO_ORGANIZER', 'STAFF'],
          default: 'STAFF'
        },
        status: { 
          type: String, 
          enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
          default: 'PENDING' 
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);