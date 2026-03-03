const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

// @desc    Create a blood request
// @route   POST /api/blood/request
const createBloodRequest = async (req, res, next) => {
    try {
        const { patientName, bloodGroup, unitsNeeded, hospitalName, location, contactPhone, notes } = req.body;

        const bloodRequest = await BloodRequest.create({
            requester: req.user._id,
            patientName,
            bloodGroup,
            unitsNeeded,
            hospitalName,
            location,
            contactPhone,
            notes
        });

        res.status(201).json({ success: true, bloodRequest });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all active blood requests
// @route   GET /api/blood/requests
const getBloodRequests = async (req, res, next) => {
    try {
        const requests = await BloodRequest.find({ status: 'open' })
            .populate('requester', 'name phone')
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a blood request status
// @route   PUT /api/blood/request/:id
const updateRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const request = await BloodRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        // Only requester can close/fulfill
        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        res.json({ success: true, request });
    } catch (err) {
        next(err);
    }
};

// @desc    Get potential donors for a blood group
// @route   GET /api/blood/donors/:group
const getDonorsByGroup = async (req, res, next) => {
    try {
        const donors = await User.find({
            bloodGroup: req.params.group,
            isBloodDonor: true
        }).select('name phone bloodGroup');

        res.json({ success: true, count: donors.length, donors });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createBloodRequest,
    getBloodRequests,
    updateRequestStatus,
    getDonorsByGroup
};
