const express = require('express');
const router = express.Router();
const { getAllUsers, getAdminStats, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
