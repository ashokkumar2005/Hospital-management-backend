// ════════════════════════════════════════
//  CAMP CONTROLLER
// ════════════════════════════════════════
const MedicalCamp = require('../models/MedicalCamp');
const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { Notification, HealthVideo, SOSAlert, Feedback } = require('../models/index');
const { asyncHandler } = require('../middleware/errorMiddleware');

// ── CAMP ──────────────────────────────────────────────────────────────────────
const getCamps = asyncHandler(async (req, res) => {
  const { upcoming } = req.query;
  let filter = { isActive: true };
  if (upcoming === 'true') filter.date = { $gte: new Date() };

  const camps = await MedicalCamp.find(filter).populate('createdBy', 'name').sort({ date: 1 });
  res.json({ success: true, camps });
});

const getCampById = asyncHandler(async (req, res) => {
  const camp = await MedicalCamp.findById(req.params.id).populate('registrations', 'name email phone');
  if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
  res.json({ success: true, camp });
});

const createCamp = asyncHandler(async (req, res) => {
  const camp = await MedicalCamp.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Medical camp created', camp });
});

const updateCamp = asyncHandler(async (req, res) => {
  const camp = await MedicalCamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
  res.json({ success: true, camp });
});

const deleteCamp = asyncHandler(async (req, res) => {
  await MedicalCamp.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Camp deleted' });
});

const registerForCamp = asyncHandler(async (req, res) => {
  const camp = await MedicalCamp.findById(req.params.id);
  if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
  if (camp.registrations.includes(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Already registered' });
  }
  if (camp.registrations.length >= camp.maxCapacity) {
    return res.status(400).json({ success: false, message: 'Camp is full' });
  }
  camp.registrations.push(req.user._id);
  await camp.save();
  res.json({ success: true, message: 'Registered for camp successfully' });
});

// ── HEALTH RECORD ─────────────────────────────────────────────────────────────
const getHealthRecord = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId || req.user._id;
  let record = await HealthRecord.findOne({ patient: patientId });
  if (!record) {
    record = await HealthRecord.create({ patient: patientId });
  }
  res.json({ success: true, record });
});

const updateHealthRecord = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId || req.user._id;
  let record = await HealthRecord.findOneAndUpdate(
    { patient: patientId },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, message: 'Health record updated', record });
});

const uploadHealthFile = asyncHandler(async (req, res) => {
  const { type, notes, doctorName, reportType } = req.body;
  const record = await HealthRecord.findOne({ patient: req.user._id });
  if (!record) return res.status(404).json({ success: false, message: 'Health record not found' });

  const filePath = `/uploads/${req.file.filename}`;
  if (type === 'prescription') {
    record.prescriptions.push({ file: filePath, doctorName, notes });
  } else {
    record.reports.push({ file: filePath, reportType, notes });
  }
  await record.save();
  res.json({ success: true, message: 'File uploaded', record });
});

// ── SOS ALERT ─────────────────────────────────────────────────────────────────
const createSOS = asyncHandler(async (req, res) => {
  const { lat, lng, address, message, nearbyHospitals } = req.body;
  const sos = await SOSAlert.create({
    user: req.user._id,
    location: { lat, lng, address },
    message: message || 'EMERGENCY! I need immediate help!',
    nearbyHospitals: nearbyHospitals || [],
  });

  // Notify all admins
  const admins = await User.find({ role: 'admin' });
  const notifPromises = admins.map((admin) =>
    Notification.create({
      user: admin._id,
      title: '🚨 SOS Emergency Alert!',
      message: `Emergency from ${req.user.name}: ${message || 'Needs immediate help'}`,
      type: 'sos',
      data: { sosId: sos._id, location: { lat, lng } },
    })
  );
  await Promise.all(notifPromises);

  res.status(201).json({ success: true, message: 'SOS alert sent', sos });
});

const getSOSAlerts = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const alerts = await SOSAlert.find(filter).populate('user', 'name phone email').sort({ createdAt: -1 });
  res.json({ success: true, alerts });
});

const resolveSOSAlert = asyncHandler(async (req, res) => {
  const sos = await SOSAlert.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved', respondedBy: req.user._id, resolvedAt: new Date() },
    { new: true }
  );
  res.json({ success: true, message: 'SOS resolved', sos });
});

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ success: true, notifications, unreadCount });
});

const markNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'Notifications marked as read' });
});

// ── HEALTH VIDEOS ─────────────────────────────────────────────────────────────
const getVideos = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const videos = await HealthVideo.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, videos });
});

const addVideo = asyncHandler(async (req, res) => {
  const { youtubeUrl } = req.body;
  // Extract YouTube ID from URL
  const match = youtubeUrl.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  const youtubeId = match ? match[1] : null;

  const video = await HealthVideo.create({ ...req.body, youtubeId, addedBy: req.user._id });
  res.status(201).json({ success: true, video });
});

const deleteVideo = asyncHandler(async (req, res) => {
  await HealthVideo.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Video deleted' });
});

// ── FEEDBACK ──────────────────────────────────────────────────────────────────
const submitFeedback = asyncHandler(async (req, res) => {
  const exists = await Feedback.findOne({ patient: req.user._id, doctor: req.body.doctorId });
  if (exists) return res.status(400).json({ success: false, message: 'You have already reviewed this doctor' });

  const feedback = await Feedback.create({ ...req.body, patient: req.user._id, doctor: req.body.doctorId });
  res.status(201).json({ success: true, feedback });
});

const getDoctorFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ doctor: req.params.doctorId, isPublic: true })
    .populate('patient', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, feedback });
});

// ── ADMIN ANALYTICS ──────────────────────────────────────────────────────────
const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalDoctors, totalAppointments, pendingAppointments, totalHospitals, totalCamps, activeSOS] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      require('../models/Hospital').countDocuments(),
      MedicalCamp.countDocuments(),
      SOSAlert.countDocuments({ status: 'active' }),
    ]);

  // Monthly appointment stats (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Appointment.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const statusBreakdown = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      totalHospitals,
      totalCamps,
      activeSOS,
      statusBreakdown,
      monthlyData: monthlyStats
    },
    recentUsers,
  });
});

// ── USER PROFILE UPDATE ───────────────────────────────────────────────────────
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, gender, dateOfBirth, emergencyContact, healthAlerts } = req.body;
  const updateData = { name, phone, address, gender, dateOfBirth, emergencyContact, healthAlerts };
  if (req.file) updateData.avatar = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated', user });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await User.countDocuments(filter);
  res.json({ success: true, users, total });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
});

module.exports = {
  // Camps
  getCamps, getCampById, createCamp, updateCamp, deleteCamp, registerForCamp,
  // Health Record
  getHealthRecord, updateHealthRecord, uploadHealthFile,
  // SOS
  createSOS, getSOSAlerts, resolveSOSAlert,
  // Notifications
  getNotifications, markNotificationsRead,
  // Videos
  getVideos, addVideo, deleteVideo,
  // Feedback
  submitFeedback, getDoctorFeedback,
  // Admin
  getAdminStats,
  // Users
  updateUserProfile, getAllUsers, toggleUserStatus,
};
