const express = require('express');
const router = express.Router();
const { 
  getMyNotifications, 
  markAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả các route bên dưới đều cần đăng nhập (protect)
router.use(protect);

// [GET] /api/notifications - Lấy danh sách thông báo
router.get('/', getMyNotifications);

// [PUT] /api/notifications/:id/read - Đánh dấu đã đọc
router.put('/:id/read', markAsRead);

// [DELETE] /api/notifications/:id - Xóa thông báo
router.delete('/:id', deleteNotification);

module.exports = router;