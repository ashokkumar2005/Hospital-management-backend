const mongoose = require('mongoose');

const medicalCampSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] }, // [lng, lat]
    },
    specialistDoctor: { type: String },
    organizer: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

medicalCampSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('MedicalCamp', medicalCampSchema);
