const express = require('express');
const router = express.Router();
const { checkSymptoms } = require('../controllers/symptomController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, checkSymptoms);

module.exports = router;
