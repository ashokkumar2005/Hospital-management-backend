const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, maxlength: 500 },
    aspects: {
      communication: { type: Number, min: 1, max: 5 },
      knowledge: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
