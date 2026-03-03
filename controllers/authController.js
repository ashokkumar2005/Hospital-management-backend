const User = require('../models/User');
const Doctor = require('../models/Doctor');
const HealthRecord = require('../models/HealthRecord');
const generateToken = require('../utils/generateToken');

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, experience, qualification, hospitalId } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'patient', phone, hospital: hospitalId });

    // If registering as doctor, create Doctor profile
    if (role === 'doctor') {
      await Doctor.create({ user: user._id, specialization: specialization || 'General', experience: experience || 0, qualification, hospital: hospitalId });
    }

    // Auto-create empty health record for patients
    if (!role || role === 'patient') {
      await HealthRecord.create({ patient: user._id });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, hospital: user.hospital },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    console.log(`Login attempt for: ${email}`);
    console.log(`Input Password: Type=${typeof password}, Length=${password?.length}`);

    // Trim and search (findOne will handle lowercase if model is set up)
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}. Provided length: ${password?.length}, DB length: ${user.password.length}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    console.log(`Login successful: ${email} (${user.role})`);
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, hospital: user.hospital },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id }).populate('hospital', 'name address');
    }
    res.json({ success: true, user, doctorProfile });
  } catch (err) {
    next(err);
  }
};

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const {
      name, phone, emergencyContact, lastVisitDate,
      healthCondition, medicineReminder,
      bloodGroup, isBloodDonor
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name, phone, emergencyContact, lastVisitDate,
        healthCondition, medicineReminder,
        bloodGroup, isBloodDonor
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile };
