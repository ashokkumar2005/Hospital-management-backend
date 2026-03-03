const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    message: { type: String, default: 'EMERGENCY! I need immediate help!' },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled', 'sent', 'acknowledged'],
      default: 'active',
    },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    nearbyHospitals: [
      {
        name: String,
        address: String,
        phone: String,
        distance: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.SOSAlert || mongoose.model('SOSAlert', sosAlertSchema);
