const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const { v4: uuidv4 } = require('uuid');

// @desc  Book appointment
// @route POST /api/appointments
const bookAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, type, reason, bookedFor } = req.body;

    // Check for conflicting appointment
    const conflict = await Appointment.findOne({ doctor, date: new Date(date), timeSlot, status: { $ne: 'cancelled' } });
    if (conflict) return res.status(400).json({ success: false, message: 'This slot is already booked' });

    const doctorDoc = await Doctor.findById(doctor).populate('user', 'name email');
    if (!doctorDoc) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const roomId = type === 'video' ? uuidv4() : null;

    const appointment = await Appointment.create({
      patient: req.user._id, doctor, bookedFor: bookedFor || null, date: new Date(date), timeSlot, type, reason, roomId,
      fee: doctorDoc.consultationFee,
    });

    // Notify doctor
    await Notification.create({
      user: doctorDoc.user._id,
      title: 'New Appointment',
      message: `New ${type} appointment booked for ${new Date(date).toDateString()} at ${timeSlot}`,
      type: 'appointment',
      link: '/doctor/appointments',
    });

    // Email confirmation
    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Appointment Confirmed – Smart Doctor App',
        html: `<h2>Appointment Confirmed</h2>
               <p>Doctor: Dr. ${doctorDoc.user.name}</p>
               <p>Date: ${new Date(date).toDateString()}</p>
               <p>Time: ${timeSlot}</p>
               <p>Type: ${type}</p>
               ${roomId ? `<p>Video Room ID: ${roomId}</p>` : ''}`,
      });
    } catch (e) { console.log('Email send failed (non-critical):', e.message); }

    await appointment.populate(['patient', 'bookedFor', { path: 'doctor', populate: { path: 'user', select: 'name email avatar' } }]);
    res.status(201).json({ success: true, appointment });
  } catch (err) { next(err); }
};

// @desc  Get appointments for logged-in user
// @route GET /api/appointments
const getAppointments = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user._id });
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      query = Appointment.find({ doctor: doctor?._id });
    } else {
      query = Appointment.find(); // admin sees all
    }
    const appointments = await query
      .populate('patient', 'name email phone')
      .populate('bookedFor', 'name relationship')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email avatar' } })
      .sort({ date: -1 });
    res.json({ success: true, count: appointments.length, appointments });
  } catch (err) { next(err); }
};

// @desc  Update appointment status
// @route PUT /api/appointments/:id
const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes, prescription, callStatus } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes, prescription, callStatus },
      { new: true }
    ).populate('patient', 'name email').populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Notify patient of status change
    if (status) {
      await Notification.create({
        user: appointment.patient._id,
        title: `Appointment ${status}`,
        message: `Your appointment on ${appointment.date.toDateString()} has been ${status}`,
        type: 'appointment',
      });
    }
    res.json({ success: true, appointment });
  } catch (err) { next(err); }
};

// @desc  Cancel appointment
// @route DELETE /api/appointments/:id
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) { next(err); }
};

module.exports = { bookAppointment, getAppointments, updateAppointment, cancelAppointment };
