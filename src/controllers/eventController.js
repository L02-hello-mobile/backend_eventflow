const Event = require('../models/Event');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');

// [POST] - Tạo sự kiện (Tự động gán người tạo)
const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      createdBy: req.user.id // Lấy ID từ token đã protect
    });
    const savedEvent = await newEvent.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [GET] - Lấy tất cả sự kiện
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'fullName email avatar');
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] - Chi tiết sự kiện & danh sách nhân sự đã đồng ý
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('members.user', 'fullName avatar email');
      
    if (!event) return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [GET] - API Thống kê tiến độ (Cho biểu đồ tròn trên Mobile)
const getEventProgress = async (req, res) => {
  try {
    const eventId = req.params.id;
    const totalTasks = await Task.countDocuments({ event: eventId });
    const completedTasks = await Task.countDocuments({ event: eventId, status: 'COMPLETED' });

    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      data: { totalTasks, completedTasks, progressPercentage: progress }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] - Mời thành viên bằng Email (Luồng Invitation)
const inviteMember = async (req, res) => {
  try {
    const { eventId, email, role } = req.body;

    const invitedUser = await User.findOne({ email });
    if (!invitedUser) return res.status(404).json({ success: false, message: 'Email chưa đăng ký tài khoản' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Sự kiện không tồn tại' });

    const exists = event.members.find(m => m.user.toString() === invitedUser._id.toString());
    if (exists) return res.status(400).json({ success: false, message: 'Người này đã được mời hoặc đã tham gia' });

    event.members.push({ user: invitedUser._id, role: role || 'STAFF', status: 'PENDING' });
    await event.save();

    await Notification.create({
      user: invitedUser._id,
      event: eventId,
      title: 'Lời mời sự kiện mới',
      message: `Bạn được mời tham gia "${event.name}" với vai trò ${role || 'STAFF'}`
    });

    res.status(200).json({ success: true, message: 'Đã gửi lời mời' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] - Phản hồi lời mời (Chấp nhận/Từ chối)
const respondToInvitation = async (req, res) => {
  try {
    const { eventId, accept } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    const memberIndex = event.members.findIndex(m => m.user.toString() === userId);

    if (memberIndex === -1) return res.status(404).json({ message: 'Không tìm thấy lời mời' });

    if (accept) {
      event.members[memberIndex].status = 'ACCEPTED';
    } else {
      event.members.splice(memberIndex, 1);
    }

    await event.save();
    res.status(200).json({ success: true, message: accept ? 'Đã gia nhập nhóm' : 'Đã từ chối lời mời' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, getEventProgress, inviteMember, respondToInvitation };