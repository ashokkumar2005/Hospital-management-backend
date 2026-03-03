const express = require('express');
const router = express.Router();
const { getHealthRecord, updateHealthRecord, uploadReport, deleteReport, getPatientHealthRecord } = require('../controllers/healthRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getHealthRecord);
router.get('/patient/:patientId', protect, authorize('doctor'), getPatientHealthRecord);
router.put('/', protect, updateHealthRecord);
router.post('/upload', protect, upload.single('file'), uploadReport);
router.delete('/report/:reportId', protect, deleteReport);

module.exports = router;
