const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    patient:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodGroup:    { type: String },
    weight:        { type: Number },
    height:        { type: Number },
    allergies:     [{ type: String }],
    medicalHistory:[{ condition: String, diagnosedYear: Number, notes: String }],
    currentMeds:   [{ name: String, dosage: String, frequency: String }],
    vaccinations:  [{ name: String, date: Date }],
    reports:       [{ title: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } }],
    prescriptions: [{ doctor: String, date: Date, fileUrl: String, notes: String }],
    assignedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
