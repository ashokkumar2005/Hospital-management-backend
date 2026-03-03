const express = require('express');
const router = express.Router();
const {
    createBloodRequest,
    getBloodRequests,
    updateRequestStatus,
    getDonorsByGroup
} = require('../controllers/bloodController');
const { protect } = require('../middleware/authMiddleware');

router.get('/requests', getBloodRequests);
router.get('/donors/:group', protect, getDonorsByGroup);
router.post('/request', protect, createBloodRequest);
router.put('/request/:id', protect, updateRequestStatus);

module.exports = router;
