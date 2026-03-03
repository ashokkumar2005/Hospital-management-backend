const HealthRecord = require('../models/HealthRecord');
const mongoose = require('mongoose');
const path = require('path');

const getHealthRecord = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    let record = await HealthRecord.findOne({ patient: patientId });

    // If no record exists, create an empty one so doctors can at least see the empty profile
    if (!record) {
      record = await HealthRecord.create({ patient: patientId, reports: [] });
    }

    res.json({ success: true, record });
  } catch (err) { next(err); }
};

const updateHealthRecord = async (req, res, next) => {
  try {
    const record = await HealthRecord.findOneAndUpdate(
      { patient: req.user._id },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ success: true, record });
  } catch (err) { next(err); }
};

const uploadReport = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const record = await HealthRecord.findOneAndUpdate(
      { patient: req.user._id },
      { $push: { reports: { title: req.body.title || req.file.originalname, fileUrl } } },
      { new: true, upsert: true }
    );
    res.json({ success: true, record });
  } catch (err) { next(err); }
};

const deleteReport = async (req, res, next) => {
  try {
    const record = await HealthRecord.findOneAndUpdate(
      { patient: req.user._id },
      { $pull: { reports: { _id: req.params.reportId } } },
      { new: true }
    );
    res.json({ success: true, record });
  } catch (err) { next(err); }
};

const getPatientHealthRecord = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Validate patientId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid Patient ID format' });
    }

    let record = await HealthRecord.findOne({ patient: patientId }).populate('patient', 'name email phone');

    // If no record exists, create one or at least return a successful empty response
    // so the doctor can see the patient's profile
    if (!record) {
      record = await HealthRecord.create({
        patient: patientId,
        reports: [],
        medicalHistory: [],
        allergies: [],
        currentMeds: []
      });
      // Re-populate patient info
      record = await record.populate('patient', 'name email phone');
    }

    res.json({ success: true, record });
  } catch (err) {
    console.error('Error in getPatientHealthRecord:', err);
    next(err);
  }
};

module.exports = { getHealthRecord, updateHealthRecord, uploadReport, deleteReport, getPatientHealthRecord };
