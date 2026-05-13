const Notification = require('../models/Notification');

/**
 * @desc    Lấy danh sách thông báo của người dùng hiện tại
 * @route   GET /api/notifications
 * @access  Private
 */
const getMyNotifications = async (req, res) => {
  try {
    // req.user.id được lấy từ middleware protect
    const notifications = await Notification.find({ user: req.user.id })
      .populate('task', 'title mapCoordinates') // Lấy thông tin tọa độ để FE xử lý Zoom
      .populate('event', 'name')
      .sort({ createdAt: -1 }) // Thông báo mới nhất hiện lên đầu
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

/**
 * @desc    Đánh dấu một thông báo là đã đọc
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }

    // Kiểm tra xem thông báo có thuộc về người dùng này không
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền cập nhật thông báo này' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Xóa một thông báo
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Không có quyền xóa' });
    }

    await notification.deleteOne();
    res.status(200).json({ success: true, message: 'Đã xóa thông báo' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  deleteNotification
};