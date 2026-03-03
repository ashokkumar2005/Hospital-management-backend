const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctor,
    updateDoctorProfile,
    getDoctorAvailability,
    hospitalAddDoctor,
    hospitalUpdateDoctor,
    hospitalDeleteDoctor
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.get('/:id/availability', getDoctorAvailability);
router.put('/profile', protect, authorize('doctor'), upload.single('image'), updateDoctorProfile);

// Hospital Controls
router.post('/hospital', protect, authorize('hospital'), hospitalAddDoctor);
router.put('/hospital/:id', protect, authorize('hospital'), hospitalUpdateDoctor);
router.delete('/hospital/:id', protect, authorize('hospital'), hospitalDeleteDoctor);

module.exports = router;
