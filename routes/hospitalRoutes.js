const express = require('express');
const router = express.Router();
const { getHospitals, getNearbyHospitals, getHospital, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getHospitals);
router.get('/nearby', getNearbyHospitals);
router.get('/:id', getHospital);
router.post('/', protect, authorize('admin'), createHospital);
router.put('/:id', protect, authorize('admin'), updateHospital);
router.delete('/:id', protect, authorize('admin'), deleteHospital);

module.exports = router;
