const express = require('express');
const router = express.Router();
const { getCamps, getAllCamps, createCamp, updateCamp, deleteCamp, registerForCamp } = require('../controllers/medicalCampController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCamps);
router.get('/all', protect, authorize('admin'), getAllCamps);
router.post('/', protect, authorize('admin'), createCamp);
router.put('/:id', protect, authorize('admin'), updateCamp);
router.delete('/:id', protect, authorize('admin'), deleteCamp);
router.post('/:id/register', protect, registerForCamp);

module.exports = router;
