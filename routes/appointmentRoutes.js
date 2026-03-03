const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointment, cancelAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
