const express = require('express');
const router = express.Router();
// Import logic từ controller
const { createUser, getAllUsers, getUserById } = require('../controllers/userController');

// Code bây giờ cực kỳ ngắn gọn và dễ đọc:
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router;