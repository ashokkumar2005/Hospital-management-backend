const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 4 },
    role: { type: String, enum: ['patient', 'doctor', 'admin', 'hospital'], default: 'patient' },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    phone: { type: String },
    avatar: { type: String },
    // For health alerts
    lastVisitDate: { type: Date },
    healthCondition: { type: String },
    medicineReminder: { type: String },
    nextReminderDate: { type: Date },
    // Emergency contact
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    isBloodDonor: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
