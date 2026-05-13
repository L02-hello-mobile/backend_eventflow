const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinary');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/upload
 * @desc    Upload một tấm ảnh lên Cloudinary
 * @access  Private (Chỉ những người đã đăng nhập mới được upload)
 */
router.post('/', protect, uploadCloud.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn một file ảnh' });
    }

    // req.file.path chính là đường dẫn URL từ Cloudinary trả về
    res.status(200).json({
      success: true,
      message: 'Tải ảnh lên thành công',
      imageUrl: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi upload' });
  }
});

module.exports = router;