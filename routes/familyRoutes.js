const express = require('express');
const router = express.Router();
const {
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMember,
    deleteFamilyMember
} = require('../controllers/familyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All family routes are protected

router.get('/', getFamilyMembers);
router.post('/', addFamilyMember);
router.put('/:id', updateFamilyMember);
router.delete('/:id', deleteFamilyMember);

module.exports = router;
