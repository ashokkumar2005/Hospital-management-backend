const express = require('express');
const router = express.Router();
const { addFeedback, getDoctorFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addFeedback);
router.get('/:doctorId', getDoctorFeedback);

module.exports = router;
