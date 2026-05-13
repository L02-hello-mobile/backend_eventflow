const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    // mapCoordinates: { x: Number, y: Number } - Lưu dưới dạng %
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getTasksByEvent = async (req, res) => {
  try {
    const tasks = await Task.find({ event: req.params.eventId })
      .populate('assignees', 'fullName avatar');
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, proofImage } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: status, proofImage: proofImage },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getTasksByEvent, updateTaskStatus };