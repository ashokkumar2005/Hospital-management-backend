const FamilyMember = require('../models/FamilyMember');

// @desc    Add a family member
// @route   POST /api/family
const addFamilyMember = async (req, res, next) => {
    try {
        const { name, relationship, dateOfBirth, gender, bloodGroup, medicalHistory } = req.body;

        const member = await FamilyMember.create({
            owner: req.user._id,
            name,
            relationship,
            dateOfBirth,
            gender,
            bloodGroup,
            medicalHistory
        });

        res.status(201).json({ success: true, member });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all family members for current user
// @route   GET /api/family
const getFamilyMembers = async (req, res, next) => {
    try {
        const members = await FamilyMember.find({ owner: req.user._id, isActive: true });
        res.json({ success: true, members });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a family member
// @route   PUT /api/family/:id
const updateFamilyMember = async (req, res, next) => {
    try {
        let member = await FamilyMember.findById(req.params.id);

        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

        if (member.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        member = await FamilyMember.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, member });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete (deactivate) a family member
// @route   DELETE /api/family/:id
const deleteFamilyMember = async (req, res, next) => {
    try {
        const member = await FamilyMember.findById(req.params.id);

        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

        if (member.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        member.isActive = false;
        await member.save();

        res.json({ success: true, message: 'Member removed' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMember,
    deleteFamilyMember
};
