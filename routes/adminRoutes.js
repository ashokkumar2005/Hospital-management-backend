const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, toggleUserStatus } = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/toggle', protect, authorize('admin'), toggleUserStatus);
module.exports = router;
