const express = require('express');
const router = express.Router();
const { createTask, getTasksByEvent, updateTaskStatus } = require('../controllers/taskController');

router.post('/', createTask);
router.get('/event/:eventId', getTasksByEvent);
router.put('/:id/status', updateTaskStatus);

module.exports = router;