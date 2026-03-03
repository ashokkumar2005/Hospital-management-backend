const MedicalCamp = require('../models/MedicalCamp');

const getCamps = async (req, res, next) => {
  try {
    const now = new Date();
    const camps = await MedicalCamp.find({ date: { $gte: now }, isActive: true }).sort({ date: 1 });
    res.json({ success: true, count: camps.length, camps });
  } catch (err) { next(err); }
};

const getAllCamps = async (req, res, next) => {
  try {
    const camps = await MedicalCamp.find().sort({ date: -1 });
    res.json({ success: true, count: camps.length, camps });
  } catch (err) { next(err); }
};

const createCamp = async (req, res, next) => {
  try {
    const camp = await MedicalCamp.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, camp });
  } catch (err) { next(err); }
};

const updateCamp = async (req, res, next) => {
  try {
    const camp = await MedicalCamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
    res.json({ success: true, camp });
  } catch (err) { next(err); }
};

const deleteCamp = async (req, res, next) => {
  try {
    await MedicalCamp.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Camp deleted' });
  } catch (err) { next(err); }
};

const registerForCamp = async (req, res, next) => {
  try {
    const camp = await MedicalCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
    if (camp.registrations.includes(req.user._id))
      return res.status(400).json({ success: false, message: 'Already registered' });
    camp.registrations.push(req.user._id);
    await camp.save();
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) { next(err); }
};

module.exports = { getCamps, getAllCamps, createCamp, updateCamp, deleteCamp, registerForCamp };
