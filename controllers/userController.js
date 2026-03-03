const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalCamp = require('../models/MedicalCamp');
const { SOSAlert } = require('../models/index');

// Admin: Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) { next(err); }
};

// Admin analytics
const getAdminStats = async (req, res, next) => {
  try {
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

    const monthlyData = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const statusBreakdown = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, totalDoctors, totalAppointments, pendingAppointments,
        totalHospitals, totalCamps, activeSOS,
        monthlyData, statusBreakdown
      }
    });
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getAdminStats, deleteUser };
