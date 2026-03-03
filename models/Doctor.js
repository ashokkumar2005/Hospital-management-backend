const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  startTime: { type: String }, // e.g. "09:00"
  endTime:   { type: String }, // e.g. "17:00"
  isAvailable: { type: Boolean, default: true },
});

const doctorSchema = new mongoose.Schema(
  {
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience:     { type: Number, default: 0 }, // years
    qualification:  { type: String },
    bio:            { type: String },
    consultationFee:{ type: Number, default: 0 },
    hospital:       { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    availability:   [availabilitySlotSchema],
    rating:         { type: Number, default: 0, min: 0, max: 5 },
    totalRatings:   { type: Number, default: 0 },
    isVerified:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
