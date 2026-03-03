const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
    {
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        patientName: { type: String, required: true },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
        unitsNeeded: { type: Number, default: 1 },
        hospitalName: { type: String, required: true },
        location: { type: String, required: true },
        contactPhone: { type: String, required: true },
        requirementDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
        notes: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
