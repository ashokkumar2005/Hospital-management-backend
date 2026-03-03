const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getDoctors = async (req, res, next) => {
  try {
    const { specialization, search, hospitalId } = req.query;
    const filter = {};
    if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
    if (hospitalId) filter.hospital = hospitalId;
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone avatar')
      .populate('hospital', 'name address');
    let result = doctors;
    if (search) {
      result = doctors.filter(d =>
        d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({ success: true, count: result.length, doctors: result });
  } catch (err) { next(err); }
};

const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('hospital', 'name address phone');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) { next(err); }
};

const updateDoctorProfile = async (req, res, next) => {
  try {
    const { specialization, experience, qualification, bio, consultationFee, availability } = req.body;

    // Handle file upload if present
    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`;
      await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    }

    // Parse availability if it's sent as a string (common with FormData)
    let parsedAvailability = availability;
    if (typeof availability === 'string') {
      try {
        parsedAvailability = JSON.parse(availability);
      } catch (e) {
        console.error('Failed to parse availability:', e);
      }
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      {
        specialization,
        experience,
        qualification,
        bio,
        consultationFee,
        availability: parsedAvailability
      },
      { new: true }
    ).populate('user', 'name email avatar');

    res.json({ success: true, doctor });
  } catch (err) { next(err); }
};

const getDoctorAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availability');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, availability: doctor.availability });
  } catch (err) { next(err); }
};

const hospitalAddDoctor = async (req, res, next) => {
  try {
    const { name, email, password, specialization, experience, qualification, consultationFee } = req.body;
    const hospitalId = req.user.hospital;

    if (!hospitalId) return res.status(403).json({ success: false, message: 'Only hospital accounts can add doctors' });

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User with this email already exists' });

    // Create user
    user = await User.create({
      name,
      email,
      password: password || 'doctor123', // Default password
      role: 'doctor'
    });

    // Create doctor profile linked to hospital
    const doctor = await Doctor.create({
      user: user._id,
      hospital: hospitalId,
      specialization,
      experience,
      qualification,
      consultationFee
    });

    res.status(201).json({ success: true, doctor });
  } catch (err) { next(err); }
};

const hospitalUpdateDoctor = async (req, res, next) => {
  try {
    const { specialization, experience, qualification, bio, consultationFee, availability } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.hospital.toString() !== req.user.hospital.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this doctor' });
    }

    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.qualification = qualification || doctor.qualification;
    doctor.bio = bio || doctor.bio;
    doctor.consultationFee = consultationFee || doctor.consultationFee;
    if (availability) doctor.availability = availability;

    await doctor.save();
    res.json({ success: true, doctor });
  } catch (err) { next(err); }
};

const hospitalDeleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (doctor.hospital.toString() !== req.user.hospital.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Unlink from hospital instead of deleting account? 
    // Usually "remove from hospital" is safer.
    doctor.hospital = null;
    await doctor.save();

    res.json({ success: true, message: 'Doctor removed from hospital' });
  } catch (err) { next(err); }
};

module.exports = {
  getDoctors,
  getDoctor,
  updateDoctorProfile,
  getDoctorAvailability,
  hospitalAddDoctor,
  hospitalUpdateDoctor,
  hospitalDeleteDoctor
};
