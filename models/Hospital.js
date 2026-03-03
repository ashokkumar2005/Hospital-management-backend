const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    address:   { type: String, required: true },
    phone:     { type: String },
    email:     { type: String },
    website:   { type: String },
    location: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    services:           [{ type: String }],
    specializations:    [{ type: String }],
    emergencyAvailable: { type: Boolean, default: false },
    beds:               { type: Number, default: 0 },
    rating:             { type: Number, default: 0 },
    image:              { type: String },
    openHours:          { type: String, default: '24/7' },
  },
  { timestamps: true }
);

// Geospatial index for nearby query
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
