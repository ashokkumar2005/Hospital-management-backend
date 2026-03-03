const Feedback = require('../models/Feedback');
const Doctor = require('../models/Doctor');

const addFeedback = async (req, res, next) => {
  try {
    const { doctor, appointment, rating, comment } = req.body;
    const existing = await Feedback.findOne({ patient: req.user._id, appointment });
    if (existing) return res.status(400).json({ success: false, message: 'Feedback already submitted' });

    const feedback = await Feedback.create({ patient: req.user._id, doctor, appointment, rating, comment });

    // Update doctor rating
    const allFeedback = await Feedback.find({ doctor });
    const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    await Doctor.findByIdAndUpdate(doctor, { rating: Math.round(avg * 10) / 10, totalRatings: allFeedback.length });

    res.status(201).json({ success: true, feedback });
  } catch (err) { next(err); }
};

const getDoctorFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ doctor: req.params.doctorId })
      .populate('patient', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, feedbacks });
  } catch (err) { next(err); }
};

module.exports = { addFeedback, getDoctorFeedback };
