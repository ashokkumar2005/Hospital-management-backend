const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The main account user
        name: { type: String, required: true, trim: true },
        relationship: { type: String, required: true }, // e.g., Father, Mother, Spouse, Child, Sibling, Other
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        medicalHistory: { type: String }, // Basic details for the doctor
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
