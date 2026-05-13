const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  getEventProgress,
  inviteMember,
  respondToInvitation
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

// Route tạo và lấy danh sách
router.post('/', protect, createEvent);
router.get('/', protect, getAllEvents);

// Route xử lý lời mời
router.post('/invite', protect, inviteMember);
router.post('/respond', protect, respondToInvitation);

// Route chi tiết (Luôn để progress lên trên :id)
router.get('/:id/progress', protect, getEventProgress);
router.get('/:id', protect, getEventById);

module.exports = router;