const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    bookedFor: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember' }, // Optional, if not 'self'
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    type: { type: String, enum: ['in-person', 'video'], default: 'in-person' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    reason: { type: String },
    notes: { type: String },
    // Video consultation
    roomId: { type: String },
    callStatus: { type: String, enum: ['idle', 'ongoing', 'ended'], default: 'idle' },
    prescription: { type: String }, // URL to uploaded prescription
    fee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
