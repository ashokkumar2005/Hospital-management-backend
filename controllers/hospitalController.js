const Hospital = require('../models/Hospital');

// @desc  Get all hospitals (with optional search/filter)
// @route GET /api/hospitals
const getHospitals = async (req, res, next) => {
  try {
    const { search, specialization, emergency } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (specialization) filter.specializations = { $in: [specialization] };
    if (emergency === 'true') filter.emergencyAvailable = true;

    const hospitals = await Hospital.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: hospitals.length, hospitals });
  } catch (err) { next(err); }
};

// @desc  Get nearby hospitals using geospatial query
// @route GET /api/hospitals/nearby?lat=&lng=&maxDistance=
const getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng are required' });

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(20);

    res.json({ success: true, count: hospitals.length, hospitals });
  } catch (err) { next(err); }
};

// @desc  Get single hospital
// @route GET /api/hospitals/:id
const getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, hospital });
  } catch (err) { next(err); }
};

// @desc  Create hospital (admin)
// @route POST /api/hospitals
const createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, hospital });
  } catch (err) { next(err); }
};

// @desc  Update hospital (admin)
// @route PUT /api/hospitals/:id
const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, hospital });
  } catch (err) { next(err); }
};

// @desc  Delete hospital (admin)
// @route DELETE /api/hospitals/:id
const deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, message: 'Hospital deleted' });
  } catch (err) { next(err); }
};

module.exports = { getHospitals, getNearbyHospitals, getHospital, createHospital, updateHospital, deleteHospital };
